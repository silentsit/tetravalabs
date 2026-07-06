import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
require("../src/lib/database-url.cjs").applyDatabaseUrlEnv()
