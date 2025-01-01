import { PrismaClient } from "@prisma/client"
import { AccountRepository } from "tm-api-auth"

export class PrismaAccountRepository implements AccountRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async createAccount(data: any): Promise<void> {
    return await this.prisma.accounts.create({ data })
  }

  async searchAccount(
    filters: any,
    pagination: { page: number; size: number }
  ): Promise<any> {
    const { page, size } = pagination
    const offset = (page - 1) * size

    const options: any = {
      where: {
        AND: [filters],
      },
      skip: offset,
      take: size,
      orderBy: { accountId: "desc" },
    }
    const accountList = await this.prisma.accounts.findMany(options)
    const count = await this.prisma.accounts.count()

    return {
      accountList,
      items: accountList.length,
      results: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    }
  }

  async getAccount(accountId: string): Promise<any> {
    return await this.prisma.accounts.findUnique({
      where: { accountId },
    })
  }

  async getRootAccount(name: string): Promise<any> {
    return await this.prisma.accounts.findUnique({
      where: { name },
    })
  }

  async updateAccount(accountId: string, data: any): Promise<void> {
    const account = await this.prisma.accounts.findUnique({
      where: { accountId },
    })

    return account.update({ ...data, accountId })
  }

  async deleteAccount(accountId: string): Promise<void> {
    const account = await this.prisma.accounts.findUnique({
      where: { accountId },
    })

    if (!account) {
      throw new Error(`Account not found`)
    }

    return account.destroy()
  }

  async deleteAccountUser(accountId: string, userId: string): Promise<void> {
    const deleteUserToAccount =
      await this.prisma.userToAccountAccessGroup.findUnique({
        where: { accountId, userId },
      })

    return deleteUserToAccount.destroy()
  }

  async updateAccountUser(
    accountId: string,
    userId: string,
    accessGroupId: string
  ): Promise<void> {
    const updateUserToAccount =
      await this.prisma.userToAccountAccessGroup.findUnique({
        where: {
          accountId,
          userId,
        },
      })

    if (!updateUserToAccount) {
      throw new Error(`User to account not found`)
    }

    updateUserToAccount.accessGroupId = accessGroupId
    return await updateUserToAccount.save()
  }
}
