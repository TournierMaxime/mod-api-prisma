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
        const users = await this.prisma.users.findMany(options);
        const count = await this.prisma.users.count();
        return {
            users,
            count,
            currentPage: page,
            totalPages: Math.ceil(count / size),
        };
    }
    async createUser(data) {
        return await this.prisma.users.create({
            data,
        });
    }
    async getUser(userId) {
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
        });
    }
    async updateUser(userId, data) {
        return await this.prisma.users.update({
            where: { userId },
            data,
        });
    }
    async deleteUser(userId) {
        return await this.prisma.users.delete({ where: { userId } });
    }
}
