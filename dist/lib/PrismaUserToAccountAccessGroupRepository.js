export class PrismaUserToAccountAccessGroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUserToAccountAccessGroup(accountId, accessGroupId, email) {
        const account = await this.prisma.accounts.findUnique({
            where: { accountId },
        });
        const accessGroup = await this.prisma.accessGroups.findUnique({
            where: { accessGroupId },
        });
        const user = await this.prisma.users.findFirst({ where: { email } });
        if (!accessGroup) {
            throw new Error(`Access group with ID ${accessGroupId} not found`);
        }
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        return this.prisma.userToAccountAccessGroup.create({
            data: {
                accountId,
                accessGroupId,
                userId: user.userId,
                accessGroupName: accessGroup.name,
            },
        });
    }
    async allUserToAccountAccessGroup(filters) {
        const options = {
            where: {
                AND: [filters],
            },
            orderBy: { accountId: "desc" },
            include: {
                account: true,
                accessGroup: true,
                user: true,
            },
        };
        return await this.prisma.userToAccountAccessGroup.findMany(options);
    }
    async getUserToAccountAccessGroup(userToAccountAccessGroupId) {
        return await this.prisma.userToAccountAccessGroup.findUnique({
            where: {
                userToAccountAccessGroupId,
            },
            include: {
                Accounts: true,
                AccessGroups: true,
                Users: true,
            },
        });
    }
}
