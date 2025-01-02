import { keys, prismaService } from "../index.js";
import { logger } from "../lib/logger.js";
prismaService.connect();
const subProcess = "createRoot";
const SUPERADMIN_USER_PASSWORD = process.env.SUPERADMIN_USER_PASSWORD;
await prismaService.prisma.$transaction(async (prisma) => {
    const [superAdminAccountAccessGroup] = await prismaService.findOrCreate(prisma.accessGroups, { name: "superAdmin" }, { name: "superAdmin" });
    const [rootAccount] = await prismaService.findOrCreate(prisma.accounts, { name: "root" }, {
        name: "root",
        status: "ok",
    });
    const [superAdminUser, superAdminUserCreated] = await prismaService.findOrCreate(prisma.users, { email: process.env.SUPERADMIN_USER_EMAIL }, {
        email: process.env.SUPERADMIN_USER_EMAIL,
        pseudo: "SuperAdmin",
        password: keys.generateKeyHash(SUPERADMIN_USER_PASSWORD),
        image: `${process.env.API_DOMAIN}/var/data/users/default.png`,
        verified: true,
    });
    await prismaService.findOrCreate(prisma.userToAccountAccessGroup, {
        userId: superAdminUser.userId,
        accountId: null,
        accessGroupId: superAdminAccountAccessGroup.accessGroupId,
    }, {
        userId: superAdminUser.userId,
        accountId: null,
        accessGroupId: superAdminAccountAccessGroup.accessGroupId,
    });
    await prismaService.findOrCreate(prisma.userToAccountAccessGroup, {
        userId: superAdminUser.userId,
        accountId: null,
        accessGroupId: superAdminAccountAccessGroup.accessGroupId,
    }, {
        userId: superAdminUser.userId,
        accountId: null,
        accessGroupId: superAdminAccountAccessGroup.accessGroupId,
    });
    return {
        rootAccount,
        superAdminUser,
        superAdminUserCreated,
    };
});
prismaService.disconnect();
logger.info({
    subProcess,
    msg: "Ended successfully",
});
