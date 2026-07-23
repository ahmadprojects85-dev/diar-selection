import { PrismaClient } from "@prisma/client";
import { connect } from "@tidbcloud/serverless";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_DB_URL = "mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";

const getPrismaClient = () => {
  const url = process.env.DATABASE_URL || DEFAULT_DB_URL;
  const connection = connect({ url });
  const adapter = new PrismaTiDBCloud(connection);
  
  // Force WASM engine type to prevent Prisma from trying to find OpenSSL via fs.readdir on Cloudflare Workers
  process.env.PRISMA_CLIENT_ENGINE_TYPE = "wasm";
  
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1500
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(`[DB Connection] Retry ${i + 1}/${maxRetries} after error:`, error?.message || error);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}
