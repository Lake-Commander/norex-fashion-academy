import { MongoClient } from 'mongodb';
import type { MetadataRoute } from 'next';
import type { WithId } from 'mongodb';

export const revalidate = 3600;

type ProductRecord = {
  slug?: string | null;
  updatedAt?: string | Date | null;
};

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://norexfashion.com').replace(/\/$/, '');
}

async function getProductRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return [];
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(process.env.MONGODB_DB || 'NorexFashion');
    const products = await db
      .collection<ProductRecord>('products')
      .find(
        { slug: { $exists: true, $ne: '' } },
        { projection: { slug: 1, updatedAt: 1, _id: 0 } }
      )
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray();

    return products
      .filter((product): product is WithId<ProductRecord> & { slug: string } => typeof product.slug === 'string' && product.slug.trim().length > 0)
      .map((product) => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Failed to generate product sitemap entries:', error);
    return [];
  } finally {
    await client.close();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticRoutes = [
    { route: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/academy', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/academy/apply', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/academy/courses', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/collections', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/collections/new-arrivals', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/customer-care', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/editorial', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/editorial/insights', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/editorial/interviews', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/editorial/stories', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/house', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/house/craftsmanship', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/house/sustainability', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/lookbook', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
    { route: '/runway', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/runway/campaigns', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/runway/fashion-films', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/runway/latest-show', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/shop', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
    { route: '/wishlist', priority: 0.7, changeFrequency: 'weekly' as const },
  ].map(({ route, ...entry }) => ({
    ...entry,
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = await getProductRoutes(baseUrl);

  return [...staticRoutes, ...productRoutes];
}