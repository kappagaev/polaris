import { exec } from "child_process"
import { GoogleOAuth } from "../google/oauth2/google"
import { startServer } from "../google/oauth2/server"
import { Config } from "../config/config"

interface LoginOptions {
  port: number
  clientId?: string
  clientSecret?: string
}
export const login = async ({ port, clientId, clientSecret }: LoginOptions) => {
  if (clientSecret === undefined) {
    throw new Error("client secret is required")
  }
  if (clientId === undefined) {
    throw new Error("client id is required")
  }
  const google = new GoogleOAuth({
    clientId,
    clientSecret,
    redirectUri: `http://localhost:${port}`,
  })

  exec(`$BROWSER "${google.getAuthURL()}"`)

  console.log(`Starting server on port ${port}`)
  const code = await startServer(port, "code")

  const tokens = await google.exchangeCodeForToken(code)

  const config = Config.get("./.polaris")
  config.setTokens(tokens).save()

  console.log("server stopped")
  console.log("code", code)
  console.log("tokens", tokens)
}
