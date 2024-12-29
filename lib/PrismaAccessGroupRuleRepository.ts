import { PrismaClient } from "@prisma/client"
import { AccessGroupRuleRepository } from "tm-api-auth"

export class PrismaAccessGroupRuleRepository
  implements AccessGroupRuleRepository
{
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async createAccessGroupRule(data: any): Promise<void> {
    const accessGroupId = data.accessGroupId
    const accessGroup = await this.prisma.accessGroups.findUnique({
      where: { accessGroupId },
    })

    return this.prisma.accessGroupsRules.create({
      ...data,
      accessGroupId,
    })
  }

  async searchAccessGroupRule(
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
      orderBy: { accessGroupRuleId: "desc" },
      include: {
        accessGroup: true,
      },
    }
    const accessGroupRuleList = await this.prisma.accessGroupsRules.findMany(
      options
    )
    const count = await this.prisma.accessGroupsRules.count()

    return {
      accessGroupRuleList,
      items: accessGroupRuleList.length,
      results: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    }
  }
}
