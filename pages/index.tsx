import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import {
  getPosts,
  getCategories,
  getPostsByCategoryWithChildren,
  getLatestExclusivePost,
  getTags,
  getPostsByTag,
  getPostUrl,
  setCategoryCache,
} from '../lib/wordpress';
import { WPPostWithMedia, WPPost } from '../types/wordpress';
import { WPCategory } from '../types/wordpress';
import Layout from '../components/layout/Layout';
import FeaturedStory from '../components/home/FeaturedStory';
import LatestNews from '../components/home/LatestNews';
import SpecialSection from '../components/home/SpecialSection';
import SportsSection from '../components/home/categories/SportsSection';
import LifestyleSection from '../components/home/categories/LifestyleSection';
import GoingViralSection from '../components/home/categories/GoingViralSection';
import LocalWorldSection from '../components/home/categories/LocalWorldSection';
import BusinessSection from '../components/home/categories/BusinessSection';
import SpotlightSection from '../components/home/categories/SpotlightSection';
import CombinedSection from '../components/home/categories/CombinedSection';
import NewsBeritaSection from '../components/home/categories/NewsBeritaSection';
import VideoSection from '../components/home/categories/VideoSection';
import OpinionSection from '../components/home/categories/OpinionSection';
import { cleanHtmlContent } from '../components/home/utils/contentCleaner';
import AdvertisementBanner from '../components/home/AdvertisementBanner';

interface HomeProps {
  posts: WPPost[];
  categories: WPCategory[];
  exclusivePost: WPPost | null;
  pinnedPost: WPPost | null;
  pinnedPosts: WPPost[];
  topStoriesPosts: WPPostWithMedia[];
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
  peopleIssuesPosts: WPPost[];
  prnPosts: WPPost[];
  palestinePosts: WPPost[];
  chinaPosts: WPPost[];
  spotlightPosts: WPPost[];
  videoPosts: WPPost[];
  opinionPosts: WPPost[];
}

function HomeInner({
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
  asiaPosts,
  businessPosts,
  corporatePosts,
  globalPosts,
  localPosts,
  smePosts,
  motoringPosts,
  educationPosts,
  peopleIssuesPosts,
  prnPosts,
  palestinePosts,
  chinaPosts,
  spotlightPosts,
  videoPosts,
  opinionPosts,
  topStoriesPosts,
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
        {/* A. Full Banner (1400×300) — Under Menu Bar */}
        <AdvertisementBanner
          desktopWidth={1400} desktopHeight={300}
          mobileWidth={320} mobileHeight={100}
          color="#2563eb" rate="RM 15,000 / week"
        />

        {/* Row 1: Top Stories (3/4) + Latest (1/4), Most Viewed below Latest */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Top Stories</h2>
            </div>
            {pinnedMain ? (
              <FeaturedStory pinnedPost={pinnedMain} categories={categories} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 lg:mb-4">No featured story available</h3>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">Check back later for the latest news</p>
              </div>
            )}

            {/* 4 stories — mobile 2 per row (gambar atas, tag + title + masa bawah), desktop gambar kiri + text kanan */}
            {bottomPosts.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {bottomPosts.map((post) => {
                  const catId = typeof post.categories?.[0] === 'number' ? post.categories[0] : (post.categories?.[0] as any)?.id;
                  const catName = catId ? cleanHtmlContent(categories.find(c => c.id === catId)?.name || '') : '';
                  const cleanTitle = cleanHtmlContent(post.title.rendered);
                  const postDate = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <Link key={post.id} href={getPostUrl(post, categories)} className="block group">
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row items-stretch h-full">
                        <div className="w-full sm:w-32 lg:w-36 aspect-[16/10] sm:aspect-auto sm:h-24 lg:h-28 shrink-0 relative bg-gray-100 overflow-hidden">
                          {(post as any).featured_media_url ? (
                            <img src={(post as any).featured_media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="p-2 sm:p-3 flex-1 min-w-0 flex flex-col">
                          {catName && (
                            <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider whitespace-nowrap mb-1">{catName}</span>
                          )}
                          <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm leading-snug">{cleanTitle}</h3>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap mt-auto pt-1">{postDate}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 mt-4 lg:mt-0">
            <LatestNews posts={latestPosts} categories={categories} />
            {/* Ganti Most Viewed dengan ads — tidak terlalu panjang, align dengan 4 top stories */}
            <div className="mt-6">
              <AdvertisementBanner
                desktopWidth={300} desktopHeight={250}
                mobileWidth={320} mobileHeight={100}
                color="#e30613" rate="RM 1,500 / week"
              />
            </div>
          </div>
        </div>

        {/* E. Middle Banner (970×90) — Under Top Stories */}
        <AdvertisementBanner
          desktopWidth={970} desktopHeight={90}
          mobileWidth={320} mobileHeight={100}
          color="#059669" rate="RM 6,000 / week"
        />

        <div className="border-t border-gray-300 my-6 sm:my-10 lg:my-16"></div>

        <SpotlightSection posts={spotlightPosts} categories={categories} />

        <GoingViralSection posts={goingViralPosts} categories={categories} />

        {/* Business — full width, tiada ads */}
        <BusinessSection
          categories={categories}
          corporatePosts={corporatePosts}
          globalPosts={globalPosts}
          localPosts={localPosts}
          smePosts={smePosts}
        />

        <LifestyleSection posts={lifestylePosts} categories={categories} />

        {/* G. Middle Banner (970×90) — Before Videos & Opinion */}
        <AdvertisementBanner
          desktopWidth={970} desktopHeight={90}
          mobileWidth={320} mobileHeight={100}
          color="#7c3aed" rate="RM 6,000 / week"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <VideoSection categories={categories} />
          </div>
          <div>
            <OpinionSection posts={opinionPosts} categories={categories} />
          </div>
        </div>

        {/* Sports — 60/40 with subscribe box */}
        <SportsSection posts={sportsPosts} categories={categories} />

        {/* Motoring / Education / People & Issues — before Local, World & Asia */}
        <CombinedSection
          motoringPosts={motoringPosts}
          educationPosts={educationPosts}
          peopleIssuesPosts={peopleIssuesPosts}
          categories={categories}
        />

        {/* Local, World & Asia — 3 columns */}
        <LocalWorldSection
          malaysiaPosts={malaysiaPosts}
          worldPosts={worldPosts}
          asiaPosts={asiaPosts}
          categories={categories}
        />

        {/* Ads (970×90) — under Local, World & Asia */}
        <AdvertisementBanner
          desktopWidth={970} desktopHeight={90}
          mobileWidth={320} mobileHeight={100}
          color="#ca8a04" rate="RM 6,000 / week"
        />

        <NewsBeritaSection
          beritaPosts={beritaPosts}
          categories={categories}
        />

        {/* H. Middle Banner (970×90) — Lower page grid layout */}
        <AdvertisementBanner
          desktopWidth={970} desktopHeight={90}
          mobileWidth={320} mobileHeight={100}
          color="#0891b2" rate="RM 6,000 / week"
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
        {/* I. Bottom Panel (970×90) — Very bottom */}
        <AdvertisementBanner
          desktopWidth={970} desktopHeight={90}
          mobileWidth={320} mobileHeight={100}
          color="#be185d" rate="RM 6,000 / week"
        />
      </div>
    </Layout>
  );
}

async function fetchAllHomeData(): Promise<HomeProps> {
  const [posts, categories, exclusivePost, tags, pinnedPosts] = await Promise.all([
    getPosts(30),
    getCategories(),
    getLatestExclusivePost(),
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
    peopleIssues: getCategoryIdBySlugOrTag('people') || getCategoryIdBySlugOrTag('issues'),
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
    categoryIds.peopleIssues ? getPostsByCategoryWithChildren(categoryIds.peopleIssues) : Promise.resolve([]),
    categoryIds.corporate ? getPostsByCategoryWithChildren(categoryIds.corporate) : Promise.resolve([]),
    categoryIds.global ? getPostsByCategoryWithChildren(categoryIds.global) : Promise.resolve([]),
    categoryIds.localSub ? getPostsByCategoryWithChildren(categoryIds.localSub) : Promise.resolve([]),
    categoryIds.sme ? getPostsByCategoryWithChildren(categoryIds.sme) : Promise.resolve([]),
  ]);

  return {
    posts: posts || [],
    categories: categories || [],
    exclusivePost: exclusivePost || null,
    pinnedPost: pinnedPosts.length > 0 ? pinnedPosts[0] : null,
    pinnedPosts,
    topStoriesPosts: [],
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
    peopleIssuesPosts: all[17] || [],
    corporatePosts: all[18] || [],
    globalPosts: all[19] || [],
    localPosts: all[20] || [],
    smePosts: all[21] || [],
  };
}

const EMPTY_HOME_PROPS: HomeProps = {
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
  peopleIssuesPosts: [],
  corporatePosts: [],
  globalPosts: [],
  localPosts: [],
  smePosts: [],
};

export const config = { maxDuration: 60 };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );
  try {
    const data = await fetchAllHomeData();
    return { props: data };
  } catch (error) {
    console.error('Home fetch failed:', error);
    return { props: EMPTY_HOME_PROPS };
  }
}

export default function Home(props: HomeProps) {
  return <HomeInner {...props} />;
}