import { GetServerSideProps } from 'next';
import Link from 'next/link';
import {
  getPosts,
  getCategories,
  getPostsByCategoryWithChildren,
  getLatestExclusivePost,
  getTags,
  getTopStories,
  getPostsByTag,
  getPostUrl,
  setCategoryCache,
} from '../lib/wordpress';
import { WPPost } from '../types/wordpress';
import { WPCategory } from '../types/wordpress';
import Layout from '../components/layout/Layout';
import FeaturedStory from '../components/home/FeaturedStory';
import LatestNews from '../components/home/LatestNews';
import SpecialSection from '../components/home/SpecialSection';
import BeritaSection from '../components/home/categories/BeritaSection';
import SportsSection from '../components/home/categories/SportsSection';
import LifestyleSection from '../components/home/categories/LifestyleSection';
import GoingViralSection from '../components/home/categories/GoingViralSection';
import LocalWorldSection from '../components/home/categories/LocalWorldSection';
import BusinessSection from '../components/home/categories/BusinessSection';
import SpotlightSection from '../components/home/categories/SpotlightSection';
import CombinedSection from '../components/home/categories/CombinedSection';
import VideoSection from '../components/home/categories/VideoSection';
import OpinionSection from '../components/home/categories/OpinionSection';
import { cleanTextContent, cleanHtmlContent } from '../components/home/utils/contentCleaner';
import { formatRelativeTime } from '../components/home/utils/timeFormatter';

interface HomeProps {
  posts: WPPost[];
  categories: WPCategory[];
  exclusivePost: WPPost | null;
  pinnedPost: WPPost | null;
  pinnedPosts: WPPost[];
  topStoriesPosts: WPPost[];
  newsPosts: WPPost[];
  beritaPosts: WPPost[];
  lifestylePosts: WPPost[];
  goingViralPosts: WPPost[];
  sportsPosts: WPPost[];
  malaysiaPosts: WPPost[];
  worldPosts: WPPost[];
  asiaPosts: WPPost[];
  businessPosts: WPPost[];
  corporatePosts: WPPost[];
  globalPosts: WPPost[];
  localPosts: WPPost[];
  smePosts: WPPost[];
  motoringPosts: WPPost[];
  educationPosts: WPPost[];
  prnPosts: WPPost[];
  palestinePosts: WPPost[];
  chinaPosts: WPPost[];
  spotlightPosts: WPPost[];
  videoPosts: WPPost[];
  opinionPosts: WPPost[];
}

export default function Home({
  posts,
  categories,
  exclusivePost,
  pinnedPost,
  pinnedPosts,
  newsPosts,
  beritaPosts,
  lifestylePosts,
  goingViralPosts,
  sportsPosts,
  malaysiaPosts,
  worldPosts,
  businessPosts,
  corporatePosts,
  globalPosts,
  localPosts,
  smePosts,
  motoringPosts,
  educationPosts,
  prnPosts,
  palestinePosts,
  chinaPosts,
  spotlightPosts,
  videoPosts,
  opinionPosts,
}: HomeProps) {
  const featuredPost = exclusivePost || posts[0];
  const isExclusive = !!exclusivePost;

  let latestPosts = [];
  if (isExclusive) {
    latestPosts = posts.slice(0, 5);
  } else {
    latestPosts = posts.slice(1, 6);
  }

  const pinnedMain = pinnedPost;
  const pinnedMore = posts.slice(1, 5);
  const bottomPosts = pinnedPosts.slice(1, 5);

  const specialSections = [
    {
      name: 'PRN',
      slug: 'prn',
      tagline: 'Latest updates on State Elections',
      backgroundColor: '#1e3a8a',
      accentColor: '#1e3a8a',
      textColor: '#ffffff',
      backgroundImage: '/images/thesun.png',
    },
    {
      name: 'Palestine',
      slug: 'palestine',
      tagline: 'Standing in solidarity with Palestine',
      backgroundColor: '#14532d',
      accentColor: '#22c55e',
      textColor: '#ffffff',
    },
    {
      name: 'China',
      slug: 'china',
      tagline: 'China-Malaysia relations and updates',
      backgroundColor: '#7f1d1d',
      accentColor: '#ef4444',
      textColor: '#ffffff',
    },
  ];

  const specialSectionPosts = {
    prn: prnPosts,
    palestine: palestinePosts,
    china: chinaPosts,
  };

  return (
    <Layout categories={categories}>
      <div className="container mx-auto px-1 sm:px-2 lg:px-3 py-6 sm:py-8">
        {/* Row 1: Pin 3/4 + Latest 1/4 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Top Story</h2>
            </div>
            {pinnedMain ? (
              <FeaturedStory pinnedPost={pinnedMain} categories={categories} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 lg:mb-4">No featured story available</h3>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">Check back later for the latest news</p>
              </div>
            )}

            {/* 4 stories — gambar lebih tinggi, category tag + timestamp sebaris sebelum title */}
            {bottomPosts.length > 0 && (
              <div className="space-y-4 mt-6">
                {[0, 2].map((start) => (
                  <div key={start} className="grid grid-cols-2 gap-4">
                    {bottomPosts.slice(start, start + 2).map((post) => {
                      const catId = typeof post.categories?.[0] === 'number' ? post.categories[0] : (post.categories?.[0] as any)?.id;
                      const catName = catId ? cleanHtmlContent(categories.find(c => c.id === catId)?.name || '') : '';
                      const cleanTitle = cleanHtmlContent(post.title.rendered);
                      const cleanExcerpt = cleanHtmlContent(post.excerpt?.rendered || '');
                      const postDate = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                          <Link key={post.id} href={getPostUrl(post, categories)} className="block group">
                           <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex border border-gray-100">
                             <div className="w-60 h-52 shrink-0 relative bg-gray-100 overflow-hidden">
                               {(post as any).featured_media_url ? (
                                 <img src={(post as any).featured_media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                 </div>
                               )}
                             </div>
                             <div className="p-3 flex-1 flex flex-col justify-center">
                               <div className="flex items-center gap-2 mb-1">
                                 {catName && (
                                   <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider whitespace-nowrap">{catName}</span>
                                 )}
                                 <span className="text-[11px] text-gray-400 whitespace-nowrap">{postDate}</span>
                               </div>
                               <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm leading-snug">{cleanTitle}</h3>
                               {cleanExcerpt && (
                                 <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cleanExcerpt.substring(0, 100)}</p>
                               )}
                             </div>
                           </div>
                         </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-1 mt-4 lg:mt-0">
            <LatestNews posts={latestPosts} categories={categories} />
          </div>
        </div>

        <div className="border-t border-gray-300 my-6 sm:my-10 lg:my-16"></div>

        <LocalWorldSection
          malaysiaPosts={malaysiaPosts}
          worldPosts={worldPosts}
          categories={categories}
        />

        <BusinessSection
          categories={categories}
          corporatePosts={corporatePosts}
          globalPosts={globalPosts}
          localPosts={localPosts}
          smePosts={smePosts}
        />

        <GoingViralSection posts={goingViralPosts} categories={categories} />

        <SportsSection posts={sportsPosts} categories={categories} />

        <LifestyleSection posts={lifestylePosts} categories={categories} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <VideoSection categories={categories} />
          </div>
          <div>
            <OpinionSection posts={opinionPosts} categories={categories} />
          </div>
        </div>

       
        <SpotlightSection posts={spotlightPosts} categories={categories} />

        <CombinedSection
          motoringPosts={motoringPosts}
          educationPosts={educationPosts}
          categories={categories}
        />

        <div className="border-t-2 border-dashed border-gray-400 my-8 sm:my-12 lg:my-20"></div>

        {specialSections.map((section) => {
          const sectionPosts = specialSectionPosts[section.slug as keyof typeof specialSectionPosts];
          if (!sectionPosts || sectionPosts.length < 3) return null;
          return (
            <div key={section.slug} className="mb-8">
              <SpecialSection
                section={section}
                posts={sectionPosts}
                categories={categories}
                featuredPost={sectionPosts[0]}
              />
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [posts, categories, exclusivePost, topStoriesPosts, tags, pinnedPosts] = await Promise.all([
      getPosts(30),
      getCategories(),
      getLatestExclusivePost(),
      getTopStories(),
      getTags(),
      getPostsByTag(50048, 5),
    ]);

    setCategoryCache(categories);

    const getCategoryIdByName = (categoryName: string): number => {
      const category = categories.find(
        (cat) => cat.name.toLowerCase().includes(categoryName.toLowerCase()) && cat.parent === 0
      );
      return category?.id || 0;
    };

    const getCategoryIdBySlugOrTag = (searchTerm: string): number => {
      const category = categories.find(
        (cat) =>
          cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return category?.id || 0;
    };

    const categoryIds = {
      news: getCategoryIdByName('news'),
      berita: getCategoryIdByName('berita'),
      lifestyle: getCategoryIdByName('lifestyle'),
      goingViral: getCategoryIdByName('going viral'),
      sports: getCategoryIdByName('sports'),
      malaysia: getCategoryIdBySlugOrTag('malaysia'),
      world: getCategoryIdBySlugOrTag('world'),
      asia: getCategoryIdBySlugOrTag('asia'),
      business: getCategoryIdBySlugOrTag('business'),
      motoring: getCategoryIdBySlugOrTag('motoring') || getCategoryIdBySlugOrTag('otomotif'),
      education: getCategoryIdBySlugOrTag('education') || getCategoryIdBySlugOrTag('pendidikan'),
      prn: getCategoryIdBySlugOrTag('prn') || getCategoryIdBySlugOrTag('pilihan raya'),
      palestine: getCategoryIdBySlugOrTag('palestine') || getCategoryIdBySlugOrTag('gaza'),
      china: getCategoryIdBySlugOrTag('china') || getCategoryIdBySlugOrTag('beijing'),
      spotlight: getCategoryIdByName('spotlight') || getCategoryIdBySlugOrTag('spotlight'),
      video: getCategoryIdBySlugOrTag('video'),
      opinion: getCategoryIdBySlugOrTag('opinion'),
      corporate: getCategoryIdBySlugOrTag('corporate') || getCategoryIdBySlugOrTag('corporate news'),
      global: getCategoryIdBySlugOrTag('global'),
      localSub: getCategoryIdBySlugOrTag('local'),
      sme: getCategoryIdBySlugOrTag('sme') || getCategoryIdBySlugOrTag('msme'),
    };

    const all = await Promise.all([
      categoryIds.news ? getPostsByCategoryWithChildren(categoryIds.news) : Promise.resolve([]),
      categoryIds.berita ? getPostsByCategoryWithChildren(categoryIds.berita) : Promise.resolve([]),
      categoryIds.lifestyle ? getPostsByCategoryWithChildren(categoryIds.lifestyle) : Promise.resolve([]),
      categoryIds.goingViral ? getPostsByCategoryWithChildren(categoryIds.goingViral) : Promise.resolve([]),
      categoryIds.sports ? getPostsByCategoryWithChildren(categoryIds.sports) : Promise.resolve([]),
      categoryIds.malaysia ? getPostsByCategoryWithChildren(categoryIds.malaysia) : Promise.resolve([]),
      categoryIds.world ? getPostsByCategoryWithChildren(categoryIds.world) : Promise.resolve([]),
      categoryIds.asia ? getPostsByCategoryWithChildren(categoryIds.asia) : Promise.resolve([]),
      categoryIds.business ? getPostsByCategoryWithChildren(categoryIds.business) : Promise.resolve([]),
      categoryIds.prn ? getPostsByCategoryWithChildren(categoryIds.prn) : Promise.resolve([]),
      categoryIds.palestine ? getPostsByCategoryWithChildren(categoryIds.palestine) : Promise.resolve([]),
      categoryIds.china ? getPostsByCategoryWithChildren(categoryIds.china) : Promise.resolve([]),
      categoryIds.spotlight ? getPostsByCategoryWithChildren(categoryIds.spotlight) : Promise.resolve([]),
      categoryIds.video ? getPostsByCategoryWithChildren(categoryIds.video) : Promise.resolve([]),
      categoryIds.opinion ? getPostsByCategoryWithChildren(categoryIds.opinion) : Promise.resolve([]),
      categoryIds.motoring ? getPostsByCategoryWithChildren(categoryIds.motoring) : Promise.resolve([]),
      categoryIds.education ? getPostsByCategoryWithChildren(categoryIds.education) : Promise.resolve([]),
      categoryIds.corporate ? getPostsByCategoryWithChildren(categoryIds.corporate) : Promise.resolve([]),
      categoryIds.global ? getPostsByCategoryWithChildren(categoryIds.global) : Promise.resolve([]),
      categoryIds.localSub ? getPostsByCategoryWithChildren(categoryIds.localSub) : Promise.resolve([]),
      categoryIds.sme ? getPostsByCategoryWithChildren(categoryIds.sme) : Promise.resolve([]),
    ]);

    return {
      props: {
        posts: posts || [],
        categories: categories || [],
        exclusivePost: exclusivePost || null,
        pinnedPost: pinnedPosts.length > 0 ? pinnedPosts[0] : null,
        pinnedPosts,
        topStoriesPosts: topStoriesPosts || [],
        newsPosts: all[0] || [],
        beritaPosts: all[1] || [],
        lifestylePosts: all[2] || [],
        goingViralPosts: all[3] || [],
        sportsPosts: all[4] || [],
        malaysiaPosts: all[5] || [],
        worldPosts: all[6] || [],
        asiaPosts: all[7] || [],
        businessPosts: all[8] || [],
        prnPosts: all[9] || [],
        palestinePosts: all[10] || [],
        chinaPosts: all[11] || [],
        spotlightPosts: all[12] || [],
        videoPosts: all[13] || [],
        opinionPosts: all[14] || [],
        motoringPosts: all[15] || [],
        educationPosts: all[16] || [],
        corporatePosts: all[17] || [],
        globalPosts: all[18] || [],
        localPosts: all[19] || [],
        smePosts: all[20] || [],
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        posts: [],
        categories: [],
        exclusivePost: null,
        pinnedPost: null,
        pinnedPosts: [],
        topStoriesPosts: [],
        newsPosts: [],
        beritaPosts: [],
        lifestylePosts: [],
        goingViralPosts: [],
        sportsPosts: [],
        malaysiaPosts: [],
        worldPosts: [],
        asiaPosts: [],
        businessPosts: [],
        prnPosts: [],
        palestinePosts: [],
        chinaPosts: [],
        spotlightPosts: [],
        videoPosts: [],
        opinionPosts: [],
        motoringPosts: [],
        educationPosts: [],
        corporatePosts: [],
        globalPosts: [],
        localPosts: [],
        smePosts: [],
      },
    };
  }
};
