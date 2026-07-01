import type { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/ProductModel';
import Course from '@/lib/models/CourseModel';
import Editorial from '@/lib/models/EditorialModel';
import RunwayCollection from '@/lib/models/RunwayCollection';

export const revalidate = 3600;

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://norexfashion.com').replace(/\/$/, '');
}

async function getProductRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const products = await Product.find(
      { slug: { $exists: true, $ne: '' } },
      { slug: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean();

    return products
      .filter((product): product is { slug: string; updatedAt?: Date | string | null } => typeof product.slug === 'string' && product.slug.trim().length > 0)
      .map((product) => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Failed to generate product sitemap entries:', error);
    return [];
  }
}

async function getCourseRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const courses = await Course.find(
      { slug: { $exists: true, $ne: '' } },
      { slug: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    return courses
      .filter((course): course is { slug: string; updatedAt?: Date | string | null } => typeof course.slug === 'string' && course.slug.trim().length > 0)
      .map((course) => ({
        url: `${baseUrl}/academy/courses/${course.slug}`,
        lastModified: course.updatedAt ? new Date(course.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Failed to generate course sitemap entries:', error);
    return [];
  }
}

async function getEditorialRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const editorials = await Editorial.find(
      { slug: { $exists: true, $ne: '' } },
      { slug: 1, contentType: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean();

    return editorials
      .filter((editorial): editorial is { slug: string; contentType?: string; updatedAt?: Date | string | null } => typeof editorial.slug === 'string' && editorial.slug.trim().length > 0)
      .map((editorial) => {
        const contentType = editorial.contentType || 'article';
        const sectionMap: Record<string, string> = {
          insight: 'insights',
          interview: 'interviews',
          story: 'stories',
        };

        const section = sectionMap[contentType] || '';
        const path = section ? `/editorial/${section}/${editorial.slug}` : `/editorial/${editorial.slug}`;

        return {
          url: `${baseUrl}${path}`,
          lastModified: editorial.updatedAt ? new Date(editorial.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        };
      });
  } catch (error) {
    console.error('Failed to generate editorial sitemap entries:', error);
    return [];
  }
}

async function getCollectionRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const collections = await RunwayCollection.find(
      { slug: { $exists: true, $ne: '' } },
      { slug: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    return collections
      .filter((collection): collection is { slug: string; updatedAt?: Date | string | null } => typeof collection.slug === 'string' && collection.slug.trim().length > 0)
      .map((collection) => ({
        url: `${baseUrl}/collections/${collection.slug}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }));
  } catch (error) {
    console.error('Failed to generate collection sitemap entries:', error);
    return [];
  }
}

async function getArchiveRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();

    const collections = await RunwayCollection.find(
      { slug: { $exists: true, $ne: '' } },
      { slug: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    return (collections as Array<{ slug: string; updatedAt?: Date | string | null }>)
      .filter((collection): collection is { slug: string; updatedAt?: Date | string | null } => typeof collection.slug === 'string' && collection.slug.trim().length > 0)
      .map((collection) => ({
        url: `${baseUrl}/archive/${collection.slug}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Failed to generate archive sitemap entries:', error);
    return [];
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
    { route: '/archive', priority: 0.8, changeFrequency: 'monthly' as const },
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
  const courseRoutes = await getCourseRoutes(baseUrl);
  const editorialRoutes = await getEditorialRoutes(baseUrl);
  const collectionRoutes = await getCollectionRoutes(baseUrl);
  const archiveRoutes = await getArchiveRoutes(baseUrl);

  return [...staticRoutes, ...productRoutes, ...courseRoutes, ...editorialRoutes, ...collectionRoutes, ...archiveRoutes];
}