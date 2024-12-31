export class PrismaAccountRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAccount(data) {
        return await this.prisma.accounts.create({ data });
    }
    async searchAccount(filters, pagination) {
        const { page, size } = pagination;
        const offset = (page - 1) * size;
        const options = {
            where: {
                AND: [filters],
            },
            skip: offset,
            take: size,
            orderBy: { accountId: "desc" },
        };
        const accountList = await this.prisma.accounts.findMany(options);
        const count = await this.prisma.accounts.count();
        return {
            accountList,
            items: accountList.length,
            results: count,
            currentPage: page,
            totalPages: Math.ceil(count / size),
        };
    }
    async getAccount(accountId) {
        return await this.prisma.accounts.findUnique({
            where: { accountId },
        });
    }
    async getRootAccount(name) {
        return await this.prisma.accounts.findUnique({
            where: { name },
        });
    }
    async updateAccount(accountId, data) {
        const account = await this.prisma.accounts.findUnique({
            where: { accountId },
        });
        return account.update({ ...data, accountId });
    }
    async deleteAccount(accountId) {
        const account = await this.prisma.accounts.findUnique({
            where: { accountId },
        });
        return account.destroy();
    }
    async deleteAccountUser(accountId, userId) {
        const deleteUserToAccount = await this.prisma.userToAccountAccessGroup.findUnique({
            where: { accountId, userId },
        });
        return deleteUserToAccount.destroy();
    }
    async updateAccountUser(accountId, userId, accessGroupId) {
        const updateUserToAccount = await this.prisma.userToAccountAccessGroup.findUnique({
            where: {
                accountId,
                userId,
            },
        });
        updateUserToAccount.accessGroupId = accessGroupId;
        return await updateUserToAccount.save();
    }
}
