export class PrismaAccessGroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAccessGroup(data) {
        return await this.prisma.accessGroups.create({ data });
    }
    async searchAccessGroup(filters, pagination) {
        const { page, size } = pagination;
        const offset = (page - 1) * size;
        const options = {
            where: {
                AND: [filters],
            },
            skip: offset,
            take: size,
            orderBy: { accessGroupId: "desc" },
        };
        const accessGroupList = await this.prisma.accessGroups.findMany(options);
        const count = await this.prisma.accessGroups.count();
        return {
            accessGroupList,
            items: accessGroupList.length,
            results: count,
            currentPage: page,
            totalPages: Math.ceil(count / size),
        };
    }
    async getOneAccessGroup(accessGroupId) {
        return await this.prisma.accessGroups.findUnique({
            where: { accessGroupId },
        });
    }
    async updateAccessGroup(accessGroupId, data) {
        const accessGroup = await this.prisma.accessGroups.findUnique({
            where: { accessGroupId },
        });
        return accessGroup.update({ ...data, accessGroupId });
    }
}
