import { prismaService } from "../index.js";
import { logger } from "../lib/logger.js";
await prismaService.connect();
await prismaService.prisma.$transaction(async (prisma) => {
    const [superAdminGroup] = await prismaService.findOrCreate(prisma.accessGroups, { name: "superAdmin" }, { name: "superAdmin" });
    // Crée le groupe d'accès 'admin'
    const [adminGroup] = await prismaService.findOrCreate(prisma.accessGroups, { name: "admin" }, { name: "admin" });
    // Crée le groupe d'accès 'customer'
    const [customerGroup] = await prismaService.findOrCreate(prisma.accessGroups, { name: "customer" }, { name: "customer" });
    const groups = [
        {
            accessGroupId: superAdminGroup.accessGroupId,
            rules: [
                "api/write",
                "api/read",
                "accounts/read",
                "accounts/write",
                "users/read",
                "users/write",
                "access-groups/write",
                "access-groups/read",
                "user-to-account/write",
                "user-to-account/read",
                "recommendation/write",
                "recommendation/read",
            ],
        },
        {
            accessGroupId: adminGroup.accessGroupId,
            rules: [
                "api/write",
                "api/read",
                "accounts/read",
                "accounts/write",
                "users/read",
                "users/write",
                "access-groups/write",
                "access-groups/read",
                "user-to-account/write",
                "user-to-account/read",
                "recommendation/write",
                "recommendation/read",
            ],
        },
        {
            accessGroupId: customerGroup.accessGroupId,
            rules: [
                "api/read",
                "accounts/read",
                "users/read",
                "users/write",
                "access-groups/read",
                "user-to-account/read",
                "recommendation/write",
                "recommendation/read",
            ],
        },
    ];
    for (const group of groups) {
        const groupRules = group.rules.map((rule) => ({
            rule,
            accessGroupId: group.accessGroupId,
        }));
        await prisma.accessGroupsRules.createMany({
            data: groupRules,
            skipDuplicates: true,
        });
    }
});
logger.info({
    subProcess: "createAccessGroupRules",
    msg: "Access groups rules created",
});
await prismaService.disconnect();
