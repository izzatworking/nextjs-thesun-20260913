import { getCategories, getShortenedCategorySlug } from '../../lib/wordpress';
import { useRouter } from 'next/router';
import CategoryPage, { getCategoryContent } from '../../components/category/CategoryPage';
import type { CategoryProps } from '../../components/category/CategoryPage';

interface LegacyCategoryPageProps {
  categoryData: CategoryProps | null;
}

export default function Category({ categoryData }: LegacyCategoryPageProps) {
  const { query } = useRouter();
  const slug = String(Array.isArray(query.slug) ? query.slug[0] : query.slug) || '';
  return <CategoryPage slug={slug} initialData={categoryData} />;
}

export const getStaticProps = async (context: { params?: Record<string, string | string[]> }) => {
  const rawSlug = context.params?.slug;
  const slug = String(Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || '';
  const categoryData = await getCategoryContent(slug);
  return { props: { categoryData } };
};

export const getStaticPaths = async () => {
  const cats = await getCategories();
  const paths = cats.filter(c => c.slug).map(c => ({ params: { slug: getShortenedCategorySlug(c.slug) } }));
  return { paths, fallback: false };
};

export const getCategoryContentExport = getCategoryContent;