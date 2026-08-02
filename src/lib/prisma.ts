import { connect } from "@tidbcloud/serverless";

const DEFAULT_DB_URL = "mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";

function getConn() {
  const rawUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;
  const url = rawUrl.trim().replace(/^["']|["']$/g, '');
  return connect({
    url,
    fetch: (input: any, init: any = {}) => {
      return fetch(input, {
        ...init,
        cache: 'force-cache',
        next: { revalidate: 60 }
      });
    }
  });
}

function formatRow(row: any) {
  if (!row) return row;
  const copy = { ...row };
  for (const k in copy) {
    if (k.startsWith('is') || k === 'inStock') {
      if (typeof copy[k] === 'number') copy[k] = Boolean(copy[k]);
    }
  }
  return copy;
}

export const prisma: any = {
  product: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      let sql = "SELECT p.* FROM products p";
      const joins: string[] = [];
      const whereClauses: string[] = [];
      const params: any[] = [];

      if (args.where) {
        if (args.where.category?.slug) {
          joins.push("JOIN categories c ON p.categoryId = c.id");
          whereClauses.push("c.slug = ?");
          params.push(args.where.category.slug);
        }
        if (args.where.brand?.slug) {
          joins.push("JOIN brands b ON p.brandId = b.id");
          whereClauses.push("b.slug = ?");
          params.push(args.where.brand.slug);
        }
        if (args.where.isBestSeller !== undefined) {
          whereClauses.push("p.isBestSeller = ?");
          params.push(args.where.isBestSeller ? 1 : 0);
        }
        if (args.where.isFeatured !== undefined) {
          whereClauses.push("p.isFeatured = ?");
          params.push(args.where.isFeatured ? 1 : 0);
        }
        if (args.where.OR) {
          const orConditions: string[] = [];
          for (const cond of args.where.OR) {
            if (cond.name?.contains) {
              orConditions.push("p.name LIKE ?");
              params.push(`%${cond.name.contains}%`);
            }
            if (cond.description?.contains) {
              orConditions.push("p.description LIKE ?");
              params.push(`%${cond.description.contains}%`);
            }
          }
          if (orConditions.length > 0) {
            whereClauses.push(`(${orConditions.join(" OR ")})`);
          }
        }
      }

      if (joins.length > 0) sql += " " + joins.join(" ");
      if (whereClauses.length > 0) sql += " WHERE " + whereClauses.join(" AND ");
      sql += " ORDER BY p.sortOrder DESC, p.createdAt DESC";
      if (args.take) sql += ` LIMIT ${parseInt(args.take)}`;

      const rows: any = await conn.execute(sql, params);
      const list = Array.isArray(rows) ? rows.map(formatRow) : [];

      if (args.include) {
        const categories: any = args.include.category ? await conn.execute("SELECT * FROM categories") : [];
        const brands: any = args.include.brand ? await conn.execute("SELECT * FROM brands") : [];
        const colors: any = args.include.colors ? await conn.execute("SELECT * FROM product_colors") : [];

        const catMap = new Map((categories || []).map((c: any) => [c.id, c]));
        const brandMap = new Map((brands || []).map((b: any) => [b.id, b]));
        const colorsGrouped = new Map<string, any[]>();
        (colors || []).forEach((col: any) => {
          const arr = colorsGrouped.get(col.productId) || [];
          arr.push(col);
          colorsGrouped.set(col.productId, arr);
        });

        return list.map(p => ({
          ...p,
          category: args.include.category ? catMap.get(p.categoryId) || null : undefined,
          brand: args.include.brand ? brandMap.get(p.brandId) || null : undefined,
          colors: args.include.colors ? colorsGrouped.get(p.id) || [] : undefined,
        }));
      }

      return list;
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      let sql = "SELECT * FROM products WHERE ";
      const params: any[] = [];
      if (args.where?.id) {
        sql += "id = ?";
        params.push(args.where.id);
      } else if (args.where?.slug) {
        sql += "slug = ?";
        params.push(args.where.slug);
      } else {
        return null;
      }
      const rows: any = await conn.execute(sql, params);
      if (!rows || rows.length === 0) return null;
      const product = formatRow(rows[0]);

      if (args.include) {
        if (args.include.category && product.categoryId) {
          const cats: any = await conn.execute("SELECT * FROM categories WHERE id = ?", [product.categoryId]);
          product.category = cats?.[0] || null;
        }
        if (args.include.brand && product.brandId) {
          const brands: any = await conn.execute("SELECT * FROM brands WHERE id = ?", [product.brandId]);
          product.brand = brands?.[0] || null;
        }
        if (args.include.colors) {
          const colors: any = await conn.execute("SELECT * FROM product_colors WHERE productId = ?", [product.id]);
          product.colors = colors || [];
        }
      }
      return product;
    },
    count: async (args: any = {}) => {
      const conn = getConn();
      const res: any = await conn.execute("SELECT COUNT(*) as count FROM products");
      return Number(res?.[0]?.count || 0);
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "prod_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO products (id, name, nameAr, nameKu, nameKm, slug, description, descriptionAr, descriptionKu, descriptionKm, longDescription, longDescriptionAr, longDescriptionKu, longDescriptionKm, price, originalPrice, currency, image, images, categoryId, brandId, isBestSeller, isFeatured, isNew, inStock, sortOrder, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id, d.name, d.nameAr || null, d.nameKu || null, d.nameKm || null, d.slug,
          d.description || null, d.descriptionAr || null, d.descriptionKu || null, d.descriptionKm || null,
          d.longDescription || null, d.longDescriptionAr || null, d.longDescriptionKu || null, d.longDescriptionKm || null,
          d.price, d.originalPrice || null, d.currency || 'IQD', d.image,
          d.images || null, d.categoryId, d.brandId || null,
          d.isBestSeller ? 1 : 0, d.isFeatured ? 1 : 0, d.isNew ? 1 : 0, d.inStock !== false ? 1 : 0, d.sortOrder || 0
        ]
      );
      if (d.colors?.create) {
        for (const col of d.colors.create) {
          const colId = "col_" + Math.random().toString(36).substr(2, 9);
          await conn.execute("INSERT INTO product_colors (id, productId, name, colorCode, image) VALUES (?, ?, ?, ?, ?)", [colId, id, col.name, col.colorCode, col.image]);
        }
      }
      return prisma.product.findUnique({ where: { id }, include: args.include });
    },
    update: async (args: any) => {
      const conn = getConn();
      const id = args.where.id;
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const key of Object.keys(d)) {
        if (key === 'colors') continue;
        fields.push(`${key} = ?`);
        let val = d[key];
        if (typeof val === 'boolean') val = val ? 1 : 0;
        params.push(val);
      }
      if (fields.length > 0) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.product.findUnique({ where: { id }, include: args.include });
    },
    delete: async (args: any) => {
      const conn = getConn();
      const item = await prisma.product.findUnique({ where: args.where });
      await conn.execute("DELETE FROM products WHERE id = ?", [args.where.id]);
      return item;
    }
  },
  category: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      let sql = "SELECT * FROM categories ORDER BY sortOrder ASC, name ASC";
      const rows: any = await conn.execute(sql);
      const list = Array.isArray(rows) ? rows : [];
      if (args.include?.products) {
        const products = await prisma.product.findMany({ include: { colors: true } });
        const prodMap = new Map<string, any[]>();
        products.forEach((p: any) => {
          const arr = prodMap.get(p.categoryId) || [];
          arr.push(p);
          prodMap.set(p.categoryId, arr);
        });
        return list.map((c: any) => ({ ...c, products: prodMap.get(c.id) || [] }));
      }
      return list;
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      const field = args.where?.id ? "id" : "slug";
      const val = args.where?.id || args.where?.slug;
      const rows: any = await conn.execute(`SELECT * FROM categories WHERE ${field} = ?`, [val]);
      return rows?.[0] || null;
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "cat_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO categories (id, name, nameAr, nameKu, nameKm, slug, description, descriptionAr, descriptionKu, descriptionKm, image, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, d.name, d.nameAr || null, d.nameKu || null, d.nameKm || null, d.slug, d.description || null, d.descriptionAr || null, d.descriptionKu || null, d.descriptionKm || null, d.image || null, d.sortOrder || 0]
      );
      return prisma.category.findUnique({ where: { id } });
    },
    update: async (args: any) => {
      const conn = getConn();
      const id = args.where.id;
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const k of Object.keys(d)) {
        fields.push(`${k} = ?`);
        params.push(d[k]);
      }
      if (fields.length > 0) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE categories SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.category.findUnique({ where: { id } });
    },
    delete: async (args: any) => {
      const conn = getConn();
      const item = await prisma.category.findUnique({ where: args.where });
      await conn.execute("DELETE FROM categories WHERE id = ?", [args.where.id]);
      return item;
    }
  },
  brand: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      const rows: any = await conn.execute("SELECT * FROM brands ORDER BY sortOrder ASC, name ASC");
      return Array.isArray(rows) ? rows : [];
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      const field = args.where?.id ? "id" : "slug";
      const val = args.where?.id || args.where?.slug;
      const rows: any = await conn.execute(`SELECT * FROM brands WHERE ${field} = ?`, [val]);
      return rows?.[0] || null;
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "brand_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO brands (id, name, nameAr, nameKu, nameKm, slug, descriptionAr, descriptionKu, descriptionKm, logo, website, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, d.name, d.nameAr || null, d.nameKu || null, d.nameKm || null, d.slug, d.descriptionAr || null, d.descriptionKu || null, d.descriptionKm || null, d.logo || null, d.website || null, d.sortOrder || 0]
      );
      return prisma.brand.findUnique({ where: { id } });
    },
    update: async (args: any) => {
      const conn = getConn();
      const id = args.where.id;
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const k of Object.keys(d)) {
        fields.push(`${k} = ?`);
        params.push(d[k]);
      }
      if (fields.length > 0) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE brands SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.brand.findUnique({ where: { id } });
    },
    delete: async (args: any) => {
      const conn = getConn();
      const item = await prisma.brand.findUnique({ where: args.where });
      await conn.execute("DELETE FROM brands WHERE id = ?", [args.where.id]);
      return item;
    }
  },
  newsArticle: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      let sql = "SELECT * FROM news_articles";
      const params: any[] = [];
      if (args.where?.isFeatured !== undefined) {
        sql += " WHERE isFeatured = ?";
        params.push(args.where.isFeatured ? 1 : 0);
      }
      sql += " ORDER BY sortOrder DESC, createdAt DESC";
      if (args.take) sql += ` LIMIT ${parseInt(args.take)}`;
      const rows: any = await conn.execute(sql, params);
      return (rows || []).map(formatRow);
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      const rows: any = await conn.execute("SELECT * FROM news_articles WHERE id = ?", [args.where.id]);
      return rows?.[0] ? formatRow(rows[0]) : null;
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "news_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO news_articles (id, tag, tagAr, tagKu, tagKm, title, titleAr, titleKu, titleKm, excerpt, excerptAr, excerptKu, excerptKm, image, isFeatured, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, d.tag, d.tagAr || null, d.tagKu || null, d.tagKm || null, d.title, d.titleAr || null, d.titleKu || null, d.titleKm || null, d.excerpt, d.excerptAr || null, d.excerptKu || null, d.excerptKm || null, d.image, d.isFeatured ? 1 : 0, d.sortOrder || 0]
      );
      return prisma.newsArticle.findUnique({ where: { id } });
    },
    update: async (args: any) => {
      const conn = getConn();
      const id = args.where.id;
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const k of Object.keys(d)) {
        fields.push(`${k} = ?`);
        let val = d[k];
        if (typeof val === 'boolean') val = val ? 1 : 0;
        params.push(val);
      }
      if (fields.length > 0) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE news_articles SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.newsArticle.findUnique({ where: { id } });
    },
    delete: async (args: any) => {
      const conn = getConn();
      const item = await prisma.newsArticle.findUnique({ where: args.where });
      await conn.execute("DELETE FROM news_articles WHERE id = ?", [args.where.id]);
      return item;
    }
  },
  brewingMethod: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      const rows: any = await conn.execute("SELECT * FROM brewing_methods ORDER BY sortOrder ASC");
      return Array.isArray(rows) ? rows : [];
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      const rows: any = await conn.execute("SELECT * FROM brewing_methods WHERE id = ?", [args.where.id]);
      return rows?.[0] || null;
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "brew_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO brewing_methods (id, name, nameAr, nameKu, nameKm, tagline, taglineAr, taglineKu, taglineKm, description, descriptionAr, descriptionKu, descriptionKm, image, time, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, d.name, d.nameAr || null, d.nameKu || null, d.nameKm || null, d.tagline || null, d.taglineAr || null, d.taglineKu || null, d.taglineKm || null, d.description || null, d.descriptionAr || null, d.descriptionKu || null, d.descriptionKm || null, d.image || null, d.time || null, d.sortOrder || 0]
      );
      return prisma.brewingMethod.findUnique({ where: { id } });
    },
    update: async (args: any) => {
      const conn = getConn();
      const id = args.where.id;
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const k of Object.keys(d)) {
        fields.push(`${k} = ?`);
        params.push(d[k]);
      }
      if (fields.length > 0) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE brewing_methods SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.brewingMethod.findUnique({ where: { id } });
    },
    delete: async (args: any) => {
      const conn = getConn();
      const item = await prisma.brewingMethod.findUnique({ where: args.where });
      await conn.execute("DELETE FROM brewing_methods WHERE id = ?", [args.where.id]);
      return item;
    }
  },
  order: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      const rows: any = await conn.execute("SELECT * FROM orders ORDER BY createdAt DESC");
      const orders = Array.isArray(rows) ? rows : [];
      if (args.include?.items) {
        const items: any = await conn.execute("SELECT * FROM order_items");
        const itemMap = new Map<string, any[]>();
        (items || []).forEach((it: any) => {
          const arr = itemMap.get(it.orderId) || [];
          arr.push(it);
          itemMap.set(it.orderId, arr);
        });
        return orders.map((o: any) => ({ ...o, items: itemMap.get(o.id) || [] }));
      }
      return orders;
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      const field = args.where?.id ? "id" : "referenceId";
      const val = args.where?.id || args.where?.referenceId;
      const rows: any = await conn.execute(`SELECT * FROM orders WHERE ${field} = ?`, [val]);
      if (!rows?.[0]) return null;
      const order = rows[0];
      if (args.include?.items) {
        const items: any = await conn.execute("SELECT * FROM order_items WHERE orderId = ?", [order.id]);
        order.items = items || [];
      }
      return order;
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "ord_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO orders (id, referenceId, customerName, phone, city, address, totalAmount, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, d.referenceId, d.customerName, d.phone, d.city, d.address, d.totalAmount, d.status || 'PENDING']
      );
      if (d.items?.create) {
        for (const item of d.items.create) {
          const itemId = "item_" + Math.random().toString(36).substr(2, 9);
          await conn.execute(
            `INSERT INTO order_items (id, orderId, productId, productName, price, quantity, color)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [itemId, id, item.productId, item.productName, item.price, item.quantity, item.color || null]
          );
        }
      }
      return prisma.order.findUnique({ where: { id }, include: args.include });
    },
    update: async (args: any) => {
      const conn = getConn();
      let id = args.where.id;
      if (!id && args.where.referenceId) {
        const found = await prisma.order.findUnique({ where: { referenceId: args.where.referenceId } });
        id = found?.id;
      }
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const k of Object.keys(d)) {
        fields.push(`${k} = ?`);
        params.push(d[k]);
      }
      if (fields.length > 0 && id) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.order.findUnique({ where: { id }, include: args.include });
    }
  },
  heroSlide: {
    findMany: async (args: any = {}) => {
      const conn = getConn();
      let sql = "SELECT * FROM hero_slides";
      const params: any[] = [];
      if (args.where?.isActive !== undefined) {
        sql += " WHERE isActive = ?";
        params.push(args.where.isActive ? 1 : 0);
      }
      sql += " ORDER BY sortOrder ASC, createdAt DESC";
      const rows: any = await conn.execute(sql, params);
      return (rows || []).map(formatRow);
    },
    findUnique: async (args: any) => {
      const conn = getConn();
      const rows: any = await conn.execute("SELECT * FROM hero_slides WHERE id = ?", [args.where.id]);
      return rows?.[0] ? formatRow(rows[0]) : null;
    },
    create: async (args: any) => {
      const conn = getConn();
      const id = "slide_" + Math.random().toString(36).substr(2, 9);
      const d = args.data;
      await conn.execute(
        `INSERT INTO hero_slides (id, title, subtitle, description, textEn, textAr, textKu, image, buttonText, buttonLink, isActive, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id,
          d.title || null,
          d.subtitle || null,
          d.description || null,
          d.textEn || null,
          d.textAr || null,
          d.textKu || null,
          d.image,
          d.buttonText || null,
          d.buttonLink || "/products",
          d.isActive !== false ? 1 : 0,
          d.sortOrder || 0
        ]
      );
      return prisma.heroSlide.findUnique({ where: { id } });
    },
    update: async (args: any) => {
      const conn = getConn();
      const id = args.where.id;
      const d = args.data;
      const fields: string[] = [];
      const params: any[] = [];
      for (const k of Object.keys(d)) {
        fields.push(`${k} = ?`);
        let val = d[k];
        if (typeof val === 'boolean') val = val ? 1 : 0;
        params.push(val);
      }
      if (fields.length > 0) {
        fields.push("updatedAt = NOW()");
        params.push(id);
        await conn.execute(`UPDATE hero_slides SET ${fields.join(", ")} WHERE id = ?`, params);
      }
      return prisma.heroSlide.findUnique({ where: { id } });
    },
    delete: async (args: any) => {
      const conn = getConn();
      const item = await prisma.heroSlide.findUnique({ where: args.where });
      await conn.execute("DELETE FROM hero_slides WHERE id = ?", [args.where.id]);
      return item;
    }
  },
  siteSetting: {
    findMany: async () => {
      const conn = getConn();
      return (await conn.execute("SELECT * FROM site_settings")) || [];
    }
  }
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}
