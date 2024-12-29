import { PrismaClient } from "@prisma/client"
import { AccessGroupRepository } from "tm-api-auth"

export class PrismaAccessGroupRepository implements AccessGroupRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async createAccessGroup(data: any): Promise<any> {
    return await this.prisma.accessGroups.create({ data })
  }

  async searchAccessGroup(
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
      orderBy: { accessGroupId: "desc" },
    }
    const accessGroupList = await this.prisma.accessGroups.findMany(options)
    const count = await this.prisma.accessGroups.count()

    return {
      accessGroupList,
      items: accessGroupList.length,
      results: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    }
  }

  async getOneAccessGroup(accessGroupId: string): Promise<any> {
    return await this.prisma.accessGroups.findUnique({
      where: { accessGroupId },
    })
  }

  async updateAccessGroup(accessGroupId: string, data: any): Promise<any> {
    const accessGroup = await this.prisma.accessGroups.findUnique({
      where: { accessGroupId },
    })

    return accessGroup.update({ ...data, accessGroupId })
  }
}
