import { PrismaClient } from "@prisma/client"
import { logger } from "./logger.js"

const subProcess = "prisma"

// Prisma instance
const prisma = new PrismaClient()

// Database connection
async function connectToDatabase(): Promise<void> {
  await prisma.$connect()
}

async function initDatabase(): Promise<void> {
  try {
    await connectToDatabase()
    logger.log("info", {
      message: `{'subProcess': '${subProcess}', 'message': 'Connection to database established'}`,
    })
  } catch (err) {
    if (err instanceof Error) {
      logger.error({
        subProcess,
        msg: "Unable to init the connection to database",
        errMsg: err.message,
      })
    } else {
      logger.error({
        subProcess,
        msg: "Unknown error during database connection",
        errMsg: String(err),
      })
    }
  }
}

async function releaseDatabase(): Promise<void> {
  await prisma.$disconnect()
}

async function executeRawQuery(query: any): Promise<any> {
  try {
    const result = await prisma.$queryRaw(query)
    return result
  } catch (err) {
    if (err instanceof Error) {
      logger.error({
        subProcess,
        msg: "Error executing raw query",
        errMsg: err.message,
      })
    } else {
      logger.error({
        subProcess,
        msg: "Unknown error executing raw query",
        errMsg: String(err),
      })
    }
    throw err
  }
}

export { prisma, initDatabase, releaseDatabase, executeRawQuery }
