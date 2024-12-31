import expressAsyncHandler from "express-async-handler"
import { Request, Response, NextFunction } from "express"
import { PrismaClient } from "@prisma/client"

interface AccessRuleCheckerDependencies {
  prisma: PrismaClient
}

export class AccessRuleChecker {
  private prisma: PrismaClient

  constructor({ prisma }: AccessRuleCheckerDependencies) {
    this.prisma = prisma
  }

  checkAccessRule(rule: string) {
    return expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const accountId = req.params.accountId
        const userId = req.userId

        if (!userId) {
          return res.status(403).json({
            message: "You do not have permission to access this resource",
          })
        }

        // Vérifiez si l'utilisateur est super admin
        const checkSuperAdmin =
          await this.prisma.userToAccountAccessGroup.findUnique({
            where: {
              userId,
              AccessGroups: {
                AccessGroupsRules: {
                  some: {
                    rule,
                  },
                },
              },
            },
            include: {
              AccessGroups: {
                include: {
                  AccessGroupsRules: true,
                },
              },
            },
          })

        if (checkSuperAdmin) {
          return next()
        }

        // Récupérez les comptes accessibles selon les règles
        const accounts = accountId
          ? await this.prisma.accounts.findUnique({
              where: {
                accountId,
                UserToAccountAccessGroup: {
                  some: {
                    AccessGroups: {
                      AccessGroupsRules: {
                        some: {
                          rule,
                        },
                      },
                    },
                  },
                },
              },
              include: {
                UserToAccountAccessGroup: {
                  include: {
                    AccessGroups: {
                      include: {
                        AccessGroupsRules: true,
                      },
                    },
                  },
                },
              },
            })
          : await this.prisma.accounts.findMany({
              where: {
                UserToAccountAccessGroup: {
                  some: {
                    AccessGroups: {
                      AccessGroupsRules: {
                        some: {
                          rule,
                        },
                      },
                    },
                  },
                },
              },
              include: {
                UserToAccountAccessGroup: {
                  include: {
                    AccessGroups: {
                      include: {
                        AccessGroupsRules: true,
                      },
                    },
                  },
                },
              },
            })

        req.accounts = accounts

        if (req.accounts && req.accounts.length > 0) {
          return next()
        }

        return res.status(403).json({
          message: "You do not have permission to access this resource",
        })
      }
    )
  }
}
