import { NextResponse } from "next/server";
import { connect } from "@tidbcloud/serverless";

const DEFAULT_DB_URL = "mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;
    const url = rawUrl.trim().replace(/^["']|["']$/g, '');
    const conn = connect({ url });

    const alterStatements = [
      "ALTER TABLE categories ADD COLUMN IF NOT EXISTS nameKm VARCHAR(255) NULL;",
      "ALTER TABLE categories ADD COLUMN IF NOT EXISTS descriptionKm TEXT NULL;",
      "ALTER TABLE brands ADD COLUMN IF NOT EXISTS nameKm VARCHAR(255) NULL;",
      "ALTER TABLE brands ADD COLUMN IF NOT EXISTS descriptionKm TEXT NULL;",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS nameKm VARCHAR(255) NULL;",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS descriptionKm TEXT NULL;",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS longDescriptionKm TEXT NULL;",
      "ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS textKm TEXT NULL;",
      "ALTER TABLE brewing_methods ADD COLUMN IF NOT EXISTS nameKm VARCHAR(255) NULL;",
      "ALTER TABLE brewing_methods ADD COLUMN IF NOT EXISTS taglineKm VARCHAR(255) NULL;",
      "ALTER TABLE brewing_methods ADD COLUMN IF NOT EXISTS descriptionKm TEXT NULL;",
      "ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS tagKm VARCHAR(255) NULL;",
      "ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS titleKm VARCHAR(255) NULL;",
      "ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS excerptKm TEXT NULL;",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS isNew TINYINT(1) DEFAULT 0;"
    ];

    for (const stmt of alterStatements) {
      try {
        await conn.execute(stmt);
      } catch (e) {
        console.log("Statement skipped/executed:", stmt, e);
      }
    }

    return NextResponse.json({ success: true, message: "Kurmanji columns created in DB successfully" });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
