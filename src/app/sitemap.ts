import { MetadataRoute } from 'next'
import { getVisibleProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productUrls: MetadataRoute.Sitemap = []

  try {
    const products = await getVisibleProducts()
    productUrls = products.map((product) => ({
      url: `https://diarselection.com/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.warn("Skipping dynamic product sitemap generation due to missing database connection during build:", error)
  }

  return [
    {
      url: 'https://diarselection.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://diarselection.com/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://diarselection.com/brands',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...productUrls,
  ]
}
