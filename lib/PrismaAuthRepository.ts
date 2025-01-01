import { PrismaClient } from "@prisma/client"
import { AuthRepository } from "tm-api-auth"
import { keys } from "../index.js"
import { verifyToken } from "tm-api-auth"

export class PrismaAuthRepository implements AuthRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async register(data: {
    pseudo: string
    email: string
    password: string
    lang: string
    provider?: string
    verified?: boolean
    expoPushToken?: string
    image?: string
  }): Promise<any> {
    return await this.prisma.users.create({ data })
  }

  async login(data: {
    email: string
    password: string
    userId?: string
  }): Promise<{ user: any; token: string }> {
    let user

    if (data.email && data.password) {
      user = await this.prisma.users.findFirst({
        where: { email: data.email },
        select: {
          userId: true,
          email: true,
          pseudo: true,
          password: true,
          image: true,
          verified: true,
          provider: true,
          expoPushToken: true,
        },
      })
    } else if (data.userId) {
      user = await this.prisma.users.findUnique({
        where: { userId: data.userId },
        select: {
          userId: true,
          email: true,
          pseudo: true,
          image: true,
          verified: true,
          provider: true,
          expoPushToken: true,
        },
      })
    }
    return user
  }

  async verifyEmail(
    userId: string,
    verificationCode: string
  ): Promise<{
    message: any
  }> {
    const user = await this.prisma.users.findUnique({
      where: { userId },
    })

    if (verificationCode === user.verificationCode) {
      await this.prisma.users.update({
        where: { userId: user.userId },
        data: {
          verified: true,
        },
      })
    }

    const message = {
      message: "Account verified successfully",
    }

    return message
  }

  async verifyAppleToken(
    identityToken: string
  ): Promise<{ valid: boolean; decodedToken: any }> {
    const decodedToken = await verifyToken(identityToken) // Fonction utilitaire pour décoder le token

    if (!decodedToken) {
      throw new Error("Invalid Apple token")
    }

    return { valid: true, decodedToken }
  }

  async forgetPassword(data: {
    email: string
    lang: string
  }): Promise<{ message: any }> {
    const user = await this.prisma.users.findFirst({
      where: { email: data.email },
    })

    const code = Math.floor(100000 + Math.random() * 900000)

    await this.prisma.users.update({
      where: { userId: user.userId },
      data: {
        forgetPassword: code,
      },
    })

    const message = {
      message: "An email was sended to your mail box",
    }

    return message
  }

  async checkForgetPasswordCode(data: {
    email: string
    code: string
  }): Promise<{ message: any }> {
    const user = await this.prisma.users.findFirst({
      where: { email: data.email },
    })

    await this.prisma.users.update({
      where: { userId: user.userId },
      data: {
        forgetPassword: data.code,
      },
    })

    const message = {
      message: "Code is valid",
    }

    return message
  }

  async resetPassword(data: {
    email: string
    password: string
    confirmPassword: string
  }): Promise<{ message: any; userId: string }> {
    const user = await this.prisma.users.findFirst({
      where: { email: data.email },
    })

    if (data.password === data.confirmPassword) {
      await this.prisma.users.update({
        where: { userId: user.userId },
        data: {
          forgetPassword: undefined,
          password: keys.generateKeyHash(data.password),
        },
      })
    }

    const message = {
      message: `Password for ${data.email} has been updated`,
      userId: user.userId,
    }

    return message
  }

  async logout(): Promise<void> {}
}
