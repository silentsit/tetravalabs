import crypto from "crypto"
import jwt from "jsonwebtoken"
import type {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  Logger
} from "@medusajs/framework/types"
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

type AppleOAuthState = {
  callback_url: string
}

export class AppleAuthService extends AbstractAuthModuleProvider {
  static identifier = "apple"
  static DISPLAY_NAME = "Apple Authentication"

  protected config_: AppleAuthOptions
  protected logger_: Logger

  static validateOptions(options: AppleAuthOptions) {
    if (!options.clientId) throw new Error("Apple clientId is required")
    if (!options.teamId) throw new Error("Apple teamId is required")
    if (!options.keyId) throw new Error("Apple keyId is required")
    if (!options.privateKey) throw new Error("Apple privateKey is required")
    if (!options.callbackUrl) throw new Error("Apple callbackUrl is required")
  }

  constructor({ logger }: { logger: Logger }, options: AppleAuthOptions) {
    // @ts-expect-error Medusa provider base constructor
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
  }

  async register(
    _: AuthenticationInput,
    __: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Apple does not support registration. Use method `authenticate` instead."
    )
  }

  async authenticate(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query = req.query ?? {}
    const body = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: query.error_description || query.error
      }
    }

    const stateKey = crypto.randomBytes(32).toString("hex")
    const callbackUrl = body.callback_url ?? this.config_.callbackUrl

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
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query = req.query ?? {}
    const body = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: query.error_description || query.error
      }
    }

    const code = query.code ?? body.code
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const stateKey = query.state
    if (!stateKey) {
      return { success: false, error: "No state provided, or session expired" }
    }

    const state = await authIdentityService.getState(stateKey)
    const callbackUrl = (state as AppleOAuthState | null)?.callback_url
    if (!callbackUrl) {
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
          redirect_uri: callbackUrl
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
      const { authIdentity, success, error } = await this.verifyIdToken_(
        tokenData.id_token,
        authIdentityService,
        body
      )

      return { success, authIdentity, error }
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
    authIdentityService: AuthIdentityProviderService,
    body: Record<string, string>
  ): Promise<AuthenticationResponse> {
    if (!idToken) {
      return { success: false, error: "No Apple ID token returned" }
    }

    const payload = jwt.decode(idToken) as AppleIdTokenPayload | null
    if (!payload?.sub) {
      return { success: false, error: "Invalid Apple ID token" }
    }

    let firstName: string | undefined
    let lastName: string | undefined

    if (body.user) {
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

    try {
      const authIdentity = await authIdentityService.retrieve({
        entity_id: payload.sub
      })
      return { success: true, authIdentity }
    } catch (error) {
      const medusaError = error as { type?: string; message?: string }
      if (medusaError.type === MedusaError.Types.NOT_FOUND) {
        const authIdentity = await authIdentityService.create({
          entity_id: payload.sub,
          user_metadata: userMetadata
        })
        return { success: true, authIdentity }
      }

      return {
        success: false,
        error: medusaError.message || "Unable to create Apple identity"
      }
    }
  }
}
