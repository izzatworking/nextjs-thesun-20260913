import { getCategories, getShortenedCategorySlug } from '../../lib/wordpress';
import { useRouter } from 'next/router';
import CategoryPage, { getCategoryContent } from '../../components/category/CategoryPage';

export default function Category() {
  const { query } = useRouter();
  const slug = String(Array.isArray(query.slug) ? query.slug[0] : query.slug) || '';
  return <CategoryPage slug={slug} />;
}

export const getStaticProps = async () => ({ props: {} });

export const getStaticPaths = async () => {
  const cats = await getCategories();
  const paths = cats.filter(c => c.slug).map(c => ({ params: { slug: getShortenedCategorySlug(c.slug) } }));
  return { paths, fallback: false };
};

export const getCategoryContentExport = getCategoryContent;