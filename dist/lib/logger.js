import winston from "winston";
import os from "os";
const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }), winston.format.printf((info) => {
        return JSON.stringify({
            timestamp: info.timestamp,
            hostname: process.env.SERVICE_HOSTNAME ?? os.hostname(),
            service: process.env.SERVICE_ID ?? "SERVICE_ID_NOT_SET",
            level: info.level,
            data: info.message,
        });
    })),
    transports: [new winston.transports.Console()],
});
export { logger };
