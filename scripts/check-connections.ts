import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "");

async function checkConnections() {
    console.log("🔍 Checking connections...\n");

    // 1. Check Redis
    try {
        console.log("Testing Redis connection...");
        await redis.set("test-connection", "success");
        const result = await redis.get("test-connection");
        if (result === "success") {
            console.log("✅ Redis connection successful!");
        } else {
            console.error("❌ Redis connection failed: Unexpected result.");
        }
        await redis.del("test-connection");
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
    }

    console.log("\n--------------------------------\n");

    // 2. Check Prisma (Database)
    try {
        const url = process.env.DATABASE_URL || "";
        // Mask password between : and @
        const maskedUrl = url.replace(/:([^@]+)@/, ":****@");
        console.log(`Testing Database connection (Prisma)...`);
        console.log(`Current DB URL format: ${maskedUrl}`);

        const userCount = await prisma.user.count();
        console.log(`✅ Database connection successful! Found ${userCount} users.`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }

    process.exit(0);
}

checkConnections();
