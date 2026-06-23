import crypto from "crypto"
import jwt from "jsonwebtoken"
import {
  AbstractAuthModuleProvider,
  MedusaError
} from "@medusajs/framework/utils"

type AppleAuthOptions = {
  clientId: string
  teamId: string
  keyId: string
  privateKey: string
  callbackUrl: string
}

type AppleIdTokenPayload = {
  sub?: string
  email?: string
  email_verified?: boolean | string
  name?: {
    firstName?: string
    lastName?: string
  }
}

export class AppleAuthService extends AbstractAuthModuleProvider {
  static identifier = "apple"
  static DISPLAY_NAME = "Apple Authentication"

  protected config_: AppleAuthOptions
  protected logger_: { warn: (message: string) => void }

  static validateOptions(options: AppleAuthOptions) {
    if (!options.clientId) throw new Error("Apple clientId is required")
    if (!options.teamId) throw new Error("Apple teamId is required")
    if (!options.keyId) throw new Error("Apple keyId is required")
    if (!options.privateKey) throw new Error("Apple privateKey is required")
    if (!options.callbackUrl) throw new Error("Apple callbackUrl is required")
  }

  constructor(
    { logger }: { logger: { warn: (message: string) => void } },
    options: AppleAuthOptions
  ) {
    // @ts-expect-error Medusa provider base constructor
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
  }

  async register() {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Apple does not support registration. Use method `authenticate` instead."
    )
  }

  async authenticate(
    req: {
      query?: Record<string, string>
      body?: Record<string, unknown>
    },
    authIdentityService: {
      setState: (key: string, value: { callback_url: string }) => Promise<void>
    }
  ) {
    const query = req.query ?? {}
    const body = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: query.error_description || query.error
      }
    }

    const stateKey = crypto.randomBytes(32).toString("hex")
    const callbackUrl =
      typeof body.callback_url === "string" ? body.callback_url : this.config_.callbackUrl

    await authIdentityService.setState(stateKey, { callback_url: callbackUrl })

    const authUrl = new URL("https://appleid.apple.com/auth/authorize")
    authUrl.searchParams.set("client_id", this.config_.clientId)
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "name email")
    authUrl.searchParams.set("response_mode", "query")
    authUrl.searchParams.set("state", stateKey)

    return { success: true, location: authUrl.toString() }
  }

  async validateCallback(
    req: {
      query?: Record<string, string>
      body?: Record<string, unknown>
    },
    authIdentityService: {
      getState: (key?: string) => Promise<{ callback_url: string } | null>
      retrieve: (input: { entity_id: string }) => Promise<unknown>
      create: (input: {
        entity_id: string
        user_metadata: Record<string, unknown>
      }) => Promise<unknown>
    }
  ) {
    const query = req.query ?? {}
    const body = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: query.error_description || query.error
      }
    }

    const code = query.code ?? (typeof body.code === "string" ? body.code : undefined)
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const state = await authIdentityService.getState(query.state)
    if (!state) {
      return { success: false, error: "No state provided, or session expired" }
    }

    try {
      const clientSecret = this.createClientSecret_()
      const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: this.config_.clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: state.callback_url
        }).toString()
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Could not exchange Apple token: ${tokenResponse.status} ${errorText}`
        )
      }

      const tokenData = (await tokenResponse.json()) as { id_token?: string }
      const { authIdentity, success } = await this.verifyIdToken_(
        tokenData.id_token,
        authIdentityService,
        body
      )

      return { success, authIdentity }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Apple authentication failed"
      return { success: false, error: message }
    }
  }

  private createClientSecret_() {
    const now = Math.floor(Date.now() / 1000)
    return jwt.sign(
      {
        iss: this.config_.teamId,
        iat: now,
        exp: now + 60 * 60 * 24 * 180,
        aud: "https://appleid.apple.com",
        sub: this.config_.clientId
      },
      this.config_.privateKey,
      {
        algorithm: "ES256",
        keyid: this.config_.keyId
      }
    )
  }

  private async verifyIdToken_(
    idToken: string | undefined,
    authIdentityService: {
      retrieve: (input: { entity_id: string }) => Promise<unknown>
      create: (input: {
        entity_id: string
        user_metadata: Record<string, unknown>
      }) => Promise<unknown>
    },
    body: Record<string, unknown>
  ) {
    if (!idToken) {
      return { success: false, error: "No Apple ID token returned" }
    }

    const payload = jwt.decode(idToken) as AppleIdTokenPayload | null
    if (!payload?.sub) {
      return { success: false, error: "Invalid Apple ID token" }
    }

    let firstName: string | undefined
    let lastName: string | undefined

    if (typeof body.user === "string") {
      try {
        const parsed = JSON.parse(body.user) as {
          name?: { firstName?: string; lastName?: string }
        }
        firstName = parsed.name?.firstName
        lastName = parsed.name?.lastName
      } catch {
        this.logger_.warn("Unable to parse Apple user payload")
      }
    }

    const userMetadata = {
      email: payload.email,
      given_name: firstName,
      family_name: lastName,
      name: [firstName, lastName].filter(Boolean).join(" ") || undefined
    }

    let authIdentity: unknown
    try {
      authIdentity = await authIdentityService.retrieve({ entity_id: payload.sub })
    } catch (error) {
      const medusaError = error as { type?: string; message?: string }
      if (medusaError.type === MedusaError.Types.NOT_FOUND) {
        authIdentity = await authIdentityService.create({
          entity_id: payload.sub,
          user_metadata: userMetadata
        })
      } else {
        return { success: false, error: medusaError.message || "Unable to create Apple identity" }
      }
    }

    return { success: true, authIdentity }
  }
}
