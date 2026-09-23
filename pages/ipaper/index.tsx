import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { WPCategory } from '../../types/wordpress';
import { getCategories } from '../../lib/wordpress';

interface Props {
  categories: WPCategory[];
}

export default function IPaperComingSoon({ categories }: Props) {
  return (
    <Layout
      categories={categories}
      title="iPaper - Coming Soon | The Sun Malaysia"
      description="The Sun iPaper digital edition is coming soon"
    >
      <Breadcrumb categories={categories} />

      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-3">
            theSun iPaper
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            The digital edition of The Sun newspaper is on its way. Bookmark this page to
            read the latest ePaper when we launch.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors"
          >
            Back to main page
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );
  const categories = await getCategories();
  return {
    props: {
      categories,
    },
  };
};