import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const u = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
    host: u.hostname,
    port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    connectionLimit: 5,
});

const g =  globalThis as unknown as { prisma?: PrismaClient };

export const db = g.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") g.prisma = db;