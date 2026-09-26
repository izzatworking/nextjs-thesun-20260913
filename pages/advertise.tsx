import Layout from '../components/layout/Layout';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thesun.my';

export default function Advertise() {
  return (
    <Layout 
      title="Advertise With Us | The Sun Malaysia"
      description="Advertising opportunities with The Sun Malaysia"
    >
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Advertise With Us</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                Reach millions of engaged readers across Malaysia with The Sun&apos;s comprehensive advertising solutions.
                Our targeted approach ensures your message reaches the right audience at the right time.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact our Advertising & Marketing Team for Print and Online</h2>
                <div className="text-gray-800 space-y-3">
                  <p className="font-semibold">Sun Media Corporation Sdn Bhd (221220-K)</p>
                  <p className="font-semibold">Head Office</p>
                  <p>Lot 6, Jalan 51/217,</p>
                  <p>46050 Petaling Jaya,</p>
                  <p>Selangor Darul Ehsan,</p>
                  <p>Malaysia</p>
                  <p>Tel: +603-77848888 / +603-77846688</p>
                  <p>Fax: +603-77852625</p>
                  <p>Email: <a href="mailto:advertise@thesundaily.com" className="text-blue-600 hover:text-blue-800 font-medium">advertise@thesundaily.com</a></p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-8 text-center">Rate Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <a 
                  href={`${SITE_URL}/wp-content/uploads/2025/10/theSun-RateCard-PRINT.pdf`} 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="group block"
                >
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors">Print Rate Card</h3>
                      <p className="text-gray-600 mb-6">Download our comprehensive print advertising rate card for detailed pricing and specifications.</p>
                      <div className="inline-flex items-center text-red-600 font-medium group-hover:text-red-800 transition-colors">
                        <span>Download PDF</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>

                <a 
                  href={`${SITE_URL}/wp-content/uploads/2025/10/theSun-Rate-Card-DIGITAL-2025.pdf`} 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="group block"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">Digital Rate Card</h3>
                      <p className="text-gray-600 mb-6">Download our digital advertising rate card for online banner ads, sponsored content, and more.</p>
                      <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                        <span>Download PDF</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>


            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}