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

    const users = await this.prisma.users.findMany(options)
    const count = await this.prisma.users.count()

    return {
      users,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    }
  }

  async createUser(data: any): Promise<any> {
    return await this.prisma.users.create({
      data,
    })
  }

  async getUser(userId: string): Promise<any> {
    return await this.prisma.users.findUnique({
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
    return await this.prisma.users.update({
      where: { userId },
      data,
    })
  }

  async deleteUser(userId: string): Promise<void> {
    return await this.prisma.users.delete({ where: { userId } })
  }
}
