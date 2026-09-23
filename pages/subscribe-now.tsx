import { GetServerSideProps } from 'next';
import Script from 'next/script';
import Layout from '../components/layout/Layout';
import Breadcrumb from '../components/common/Breadcrumb';
import { WPCategory } from '../types/wordpress';
import { getCategories } from '../lib/wordpress';

interface Props {
  categories: WPCategory[];
}

export default function SubscribeNow({ categories }: Props) {

  return (
    <Layout 
      categories={categories}
      title="Subscribe Now | The Sun Malaysia"
      description="Subscribe to The Sun Malaysia newspaper"
    >
      <div className="iter-page-frame">
        <div className="iter-content-wrapper iter-droppable-zone" id="iter-content-wrapper">
          <div id="main-content" className="content ly-catalog-section" role="main">
            <div className="container-fluid nopadding bg-ready bg-ready-1">
              <div className="container nopadding">
                <div className="row main-news">
                  <div className="main-news-left-col portlet-column nopadding" id="main-news-left-col">
                    <div id="" className="portlet-boundary portlet-static-end htmlcontainer-portlet">
                      <div>
                        <iframe src="https://www.cognitoforms.com/f/n-LP1BRmAUebkBV_v5ZoYQ/27" style={{ border: 0, width: '100%' }} height="2447"></iframe>
                        <Script src="https://www.cognitoforms.com/f/iframe.js" strategy="afterInteractive" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="container nopadding">
              <div className="row standard-news">
                <div className="standard-news-left-col col-sm-8 portlet-column nopadding" id="standard-news-left-col">
                  <div className="row standard-news-left-col-top-row">
                    <div className="standard-news-left-col-top-row-left-col portlet-column nopadding" id="standard-news-left-col-top-row-left-col">
                    </div>
                  </div>
                </div>
                <div className="top-right-col col-sm-4 portlet-column nopadding" id="top-right-col">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="iter-footer-wrapper" id="iter-footer-wrapper">
          <div className="portlet-boundary portlet-static-end portlet-nested-portlets">
            <div id="theme-4-footer" className="ly-theme-4-footer">
              <div className="container top">
                <div className="row top">
                  <div className="top-one-col col-sm-4 portlet-column nopadding" id="top-one-col"></div>
                  <div className="top-two-col col-sm-4 portlet-column nopadding" id="top-two-col"></div>
                  <div className="top-three-col col-sm-4 portlet-column nopadding" id="top-three-col"></div>
                </div>
                <div className="row medium">
                  <div className="medium-one-col portlet-column nopadding" id="medium-one-col">
                    <div id="1505973987" className="portlet-boundary portlet-static-end menu-portlet footer-navigation">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
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