import { GetServerSideProps } from 'next';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/common/Breadcrumb';
import { WPCategory } from '../types/wordpress';

interface Props {
  categories: WPCategory[];
}

export default function Subscriptions({ categories }: Props) {
  return (
    <Layout 
      categories={categories}
      title="Subscriptions | The Sun Malaysia"
      description="Subscription options for The Sun Malaysia newspaper"
    >
      <Breadcrumb categories={categories} />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Newspaper Subscriptions</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Stay informed with daily delivery of The Sun Malaysia newspaper. Choose from our
                flexible subscription options designed to fit your needs and budget.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Subscription</h3>
                  <p className="text-2xl font-bold text-red-600 mb-4">RM 25/month</p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>• Monday to Saturday delivery</li>
                    <li>• Digital access included</li>
                    <li>• Cancel anytime</li>
                  </ul>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Subscribe Now
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Weekend Only</h3>
                  <p className="text-2xl font-bold text-red-600 mb-4">RM 15/month</p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>• Saturday & Sunday delivery</li>
                    <li>• Digital weekend edition</li>
                    <li>• Weekend specials included</li>
                  </ul>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Subscribe Now
                  </button>
                </div>

                <div className="border border-red-200 rounded-lg p-6 bg-red-50 border-2">
                  <div className="text-xs text-red-600 font-semibold mb-2">MOST POPULAR</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Annual Subscription</h3>
                  <p className="text-2xl font-bold text-red-600 mb-4">RM 250/year</p>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>• Daily delivery all year</li>
                    <li>• Digital access included</li>
                    <li>• Save 17% vs monthly</li>
                  </ul>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Subscribe Now
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Delivery Areas</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We currently deliver to Kuala Lumpur, Selangor, Penang, Johor Bahru, and major cities across Malaysia.
                For delivery availability in your area, please contact our subscription team.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Our Subscription Team</h3>
                <p className="text-gray-600 mb-2">📞 Phone: +60 3 1234 5678</p>
                <p className="text-gray-600 mb-2">📧 Email: subscriptions@thesun.my</p>
                <p className="text-gray-600">🕒 Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );
  return {
    props: {
      categories: []
    }
  };
};
