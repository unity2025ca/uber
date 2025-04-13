import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function authenticateUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authenticated: false }
    }

    const token = authHeader.split(" ")[1]

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    return {
      authenticated: true,
      user: payload,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { authenticated: false }
  }
}
