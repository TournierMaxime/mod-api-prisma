export class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchUsers(filters, pagination) {
        const { page, size } = pagination;
        const offset = (page - 1) * size;
        const options = {
            where: {
                AND: [filters],
            },
            select: { userId: true, pseudo: true, email: true },
            skip: offset,
            take: size,
            orderBy: { userId: "desc" },
        };
        const users = await this.prisma.user.findMany(options);
        const count = await this.prisma.user.count();
        return {
            users,
            count,
            currentPage: page,
            totalPages: Math.ceil(count / size),
        };
    }
    async createUser(data) {
        return await this.prisma.user.create({
            data,
        });
    }
    async getUser(userId) {
        return await this.prisma.user.findUnique({
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
        });
    }
    async updateUser(userId, data) {
        return await this.prisma.user.update({
            where: { userId },
            data,
        });
    }
    async deleteUser(userId) {
        return await this.prisma.user.delete({ where: { userId } });
    }
}
