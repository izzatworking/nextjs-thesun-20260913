import { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/common/Breadcrumb';
import { WPCategory } from '../types/wordpress';
import { getCategories } from '../lib/wordpress';
import { CountdownBanner } from '../components/ads/CountdownBanner';

interface Props {
  categories: WPCategory[];
}

export default function CountdownDemo({ categories }: Props) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 15);
  targetDate.setHours(23, 59, 59, 0);

  return (
    <Layout
      categories={categories}
      title="Countdown Banner Demo | The Sun Malaysia"
      description="Countdown Banner Demo"
    >
      <Breadcrumb categories={categories} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Countdown Banner (A: Full Banner)</h1>
        <p className="text-lg mb-6 text-gray-600">
          Size: 1400x400px — guna komponen <code className="bg-gray-100 px-2 py-1 rounded text-sm">CountdownBanner</code>
        </p>

        <CountdownBanner
          targetDate={targetDate}
          backgroundImage="/images/banner-wc-cd.png"
          link="https://thesun.my"
        />

        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Cara Guna:</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { CountdownBanner } from '../components/ads/CountdownBanner';

<CountdownBanner
  targetDate={new Date('2026-06-15T23:59:59')}
  title="YOUR TITLE"
  subtitle="Your subtitle here"
  backgroundImage="/banners/your-image.jpg"
  link="https://your-link.com"
/>`}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await getCategories();
  return {
    props: {
      categories,
    },
  };
};
