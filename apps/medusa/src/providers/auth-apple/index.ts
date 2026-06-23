import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { AppleAuthService } from "./service"

export default ModuleProvider(Modules.AUTH, {
  services: [AppleAuthService]
})
