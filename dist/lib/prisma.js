import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";
class PrismaService {
    constructor(subProcess = "prisma") {
        this.prisma = new PrismaClient();
        this.subProcess = subProcess;
    }
    /**
     * Establishes a connection to the database.
     */
    async connect() {
        try {
            await this.prisma.$connect();
            logger.log("info", {
                message: `{'subProcess': '${this.subProcess}', 'message': 'Connection to database established'}`,
            });
        }
        catch (err) {
            this.handleError("Unable to connect to database", err);
        }
    }
    /**
     * Releases the database connection.
     */
    async disconnect() {
        try {
            await this.prisma.$disconnect();
            logger.log("info", {
                message: `{'subProcess': '${this.subProcess}', 'message': 'Database connection closed'}`,
            });
        }
        catch (err) {
            this.handleError("Error while disconnecting from the database", err);
        }
    }
    /**
     * Executes a raw query.
     * @param query - The raw query to execute.
     * @returns The result of the query execution.
     */
    async executeRawQuery(query) {
        try {
            const result = await this.prisma.$queryRaw(query);
            return result;
        }
        catch (err) {
            this.handleError("Error executing raw query", err);
            throw err; // Rethrow to allow the caller to handle it.
        }
    }
    /**
     * Handles errors by logging them.
     * @param message - The custom message for the error.
     * @param err - The error object.
     */
    handleError(message, err) {
        if (err instanceof Error) {
            logger.error({
                subProcess: this.subProcess,
                msg: message,
                errMsg: err.message,
            });
        }
        else {
            logger.error({
                subProcess: this.subProcess,
                msg: message,
                errMsg: String(err),
            });
        }
    }
}
export { PrismaService };
