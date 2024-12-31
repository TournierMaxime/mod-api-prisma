import { Express } from "express"
import { WebSocketServer } from "ws"

declare global {
  namespace Express {
    interface Request {
      userId: string
      accounts?: string | Array
      wss?: WebSocketServer
    }
  }
}

export {}
