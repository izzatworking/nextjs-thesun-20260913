import { GetServerSideProps } from 'next';
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

export const getServerSideProps: GetServerSideProps<LegacyCategoryPageProps> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=600'
  );
  const rawSlug = context.params?.slug;
  const slug = String(Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || '';
  const categoryData = await getCategoryContent(slug);
  return { props: { categoryData } };
};

export const getCategoryContentExport = getCategoryContent;
