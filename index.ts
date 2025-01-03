import { PrismaClient } from "@prisma/client"
import { PrismaService } from "./lib/prisma.js"
import { Keys } from "tm-api-common"

export { logger } from "./lib/logger.js"
export { PrismaService } from "./lib/prisma.js"
export { PrismaAuthRepository } from "./lib/PrismaAuthRepository.js"
export { PrismaAccessGroupRepository } from "./lib/PrismaAccessGroupRepository.js"
export { PrismaAccessGroupRuleRepository } from "./lib/PrismaAccessGroupRuleRepository.js"
export { PrismaAccountRepository } from "./lib/PrismaAccountRepository.js"
export { PrismaUserRepository } from "./lib/PrismaUserRepository.js"
export { PrismaUserToAccountAccessGroupRepository } from "./lib/PrismaUserToAccountAccessGroupRepository.js"
export { AccessRuleChecker } from "./lib/checkAccessAccounts.js"

const prisma = new PrismaClient()
export const prismaService = new PrismaService(prisma, "prisma")

export const keys = new Keys()
