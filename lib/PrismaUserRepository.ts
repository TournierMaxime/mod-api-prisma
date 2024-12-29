import { PrismaClient } from "@prisma/client"
import { UserRepository } from "tm-api-auth"

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async searchUsers(
    filters: any,
    pagination: { page: number; size: number }
  ): Promise<any> {
    const { page, size } = pagination
    const offset = (page - 1) * size

    const options: any = {
      where: {
        AND: [filters],
      },
      select: { userId: true, pseudo: true, email: true },
      skip: offset,
      take: size,
      orderBy: { userId: "desc" },
    }

    const users = await this.prisma.user.findMany(options)
    const count = await this.prisma.user.count()

    return {
      users,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    }
  }

  async getUser(userId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        pseudo: true,
        email: true,
        verified: true,
        image: true,
        expoPushToken: true,
        provider: true,
        isEmailActive: true,
      },
    })
  }

  async updateUser(userId: string, data: any): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data,
    })
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { userId } })
  }
}
