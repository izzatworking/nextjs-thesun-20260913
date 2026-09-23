import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { WPCategory } from '../../types/wordpress';
import { getCategories } from '../../lib/wordpress';

interface Props {
  categories: WPCategory[];
}

export default function RateCard({ categories }: Props) {
  return (
    <Layout 
      categories={categories}
      title="Rate Card | The Sun Malaysia"
      description="Contact our Advertising & Marketing Team for Print and Online"
    >
      <Breadcrumb categories={categories} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Advertise With Us</h1>
        <p className="text-lg mb-4">
          Contact our Advertising & Marketing Team for Print and Online
        </p>
        <p className="mb-4">
          Malaysia&apos;s leading news source delivering accurate, timely, and comprehensive coverage
          of news, sports, entertainment, and current events across Malaysia and globally.
        </p>
        <p className="mb-4">
          For advertising inquiries, please contact us at:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Email: advertising@thesun.my</li>
          <li>Phone: +603 7784 6688</li>
        </ul>
        <p>
          Our Rate Card is available upon request. Please reach out to our team for the latest rates and packages.
        </p>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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