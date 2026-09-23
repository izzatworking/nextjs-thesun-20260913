// pages/author/index.tsx - Author Listing Page
import { GetServerSideProps } from 'next';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { WPAuthor, WPCategory } from '../../types/wordpress';
import { getAllAuthors, getAuthorPostCount, getCategories } from '../../lib/wordpress';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser, FiFileText, FiChevronRight, FiUsers, FiTrendingUp } from 'react-icons/fi';

interface AuthorWithStats extends WPAuthor {
  postCount: number;
}

interface Props {
  authors: AuthorWithStats[];
  categories: WPCategory[];
}

function AuthorListingPageInner({ authors: initialAuthors, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'posts'>('name');
  const authors = initialAuthors;

  // Filter and sort authors
  const filteredAuthors = useMemo(() => {
    let result = [...authors];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(author => 
        author.display_name.toLowerCase().includes(query) ||
        author.first_name.toLowerCase().includes(query) ||
        author.last_name.toLowerCase().includes(query) ||
        (author.description || '').toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.display_name.localeCompare(b.display_name);
      } else {
        return b.postCount - a.postCount;
      }
    });
    
    return result;
  }, [authors, searchQuery, sortBy]);

  return (
    <Layout 
      categories={categories}
      title="Authors | The Sun Malaysia"
      description="Meet our team of writers and journalists at The Sun Malaysia"
    >
      <Breadcrumb categories={categories} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Authors
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Meet the talented writers and journalists who bring you the latest news and stories from The Sun Malaysia.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search authors by name or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSortBy('name')}
                    className={`px-4 py-2 rounded-md transition-all ${sortBy === 'name' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Name
                  </button>
                  <button
                    onClick={() => setSortBy('posts')}
                    className={`px-4 py-2 rounded-md transition-all ${sortBy === 'posts' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Articles
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-600">
              Showing {filteredAuthors.length} of {authors.length} authors
            </div>
          </div>

          {/* Authors Grid */}
          {filteredAuthors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <FiUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No authors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAuthors.map((author) => (
                <div
                  key={author.term_id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Author Card */}
                  <div className="p-6">
                    {/* Avatar and Name */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                          {author.avatar_url?.url ? (
                            <img
                              src={author.avatar_url.url}
                              alt={author.display_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.display_name)}&background=3b82f6&color=ffffff&size=128`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                              {author.display_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {author.postCount > 0 && (
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                            {author.postCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {author.display_name}
                        </h3>
                        {author.job_title && (
                          <p className="text-sm text-blue-600 font-medium">{author.job_title}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {author.description && author.description.trim() && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {author.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <FiFileText className="h-4 w-4" />
                        <span>{author.postCount} articles</span>
                      </div>
                      
                      {author.first_name && author.last_name && (
                        <div className="text-gray-400">
                          {author.first_name} {author.last_name}
                        </div>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href={`/author/${author.slug}`}
                      className="block w-full py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group-hover:shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>View Profile</span>
                      <FiChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Featured Authors Section */}
          {authors.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                    <FiTrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Top Contributors</h2>
                </div>
                <div className="text-gray-600">
                  Based on article count
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {authors
                  .sort((a, b) => b.postCount - a.postCount)
                  .slice(0, 3)
                  .map((author, index) => (
                    <div
                      key={author.term_id}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                            {author.avatar_url?.url ? (
                              <img
                                src={author.avatar_url.url}
                                alt={author.display_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.display_name)}&background=3b82f6&color=ffffff&size=160`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl">
                                {author.display_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          {index < 3 && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                              #{index + 1}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-xl">
                            {author.display_name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                              {author.postCount} articles
                            </div>
                            {author.job_title && (
                              <div className="text-gray-600 text-sm">
                                {author.job_title}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/author/${author.slug}`}
                        className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                      >
                        Read all articles
                        <FiChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Empty State for No Authors */}
          {authors.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                <FiUsers className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Authors Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn&apos;t find any authors with published articles. This could be because:
              </p>
              <ul className="text-gray-600 text-left max-w-md mx-auto mb-8 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Authors haven&apos;t published any articles yet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Author data is being updated</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Admin users have been filtered out</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Refresh Page
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function AuthorListingPage(props: Props) {
  return <AuthorListingPageInner {...props} />;
}

export const config = { maxDuration: 60 };

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=1200'
  );

  try {
    const [allAuthors, categories] = await Promise.all([
      getAllAuthors(),
      getCategories(),
    ]);

    const authorsWithStats: AuthorWithStats[] = [];

    // Process authors in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < allAuthors.length; i += batchSize) {
      const batch = allAuthors.slice(i, i + batchSize);

      const batchPromises = batch.map(async (author) => {
        try {
          const postCount = await Promise.race([
            getAuthorPostCount(author.term_id, author.slug),
            new Promise<number>((resolve) => setTimeout(() => resolve(1), 2000)),
          ]);

          return { ...author, postCount: postCount || 1 };
        } catch (error) {
          console.error(`❌ Error getting post count for ${author.display_name}:`, error);
          return { ...author, postCount: 1 };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      authorsWithStats.push(...batchResults);

      if (i + batchSize < allAuthors.length) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    const filteredAuthors = authorsWithStats
      .filter((author) => author.postCount > 0)
      .sort((a, b) => a.display_name.localeCompare(b.display_name));

    return { props: { authors: filteredAuthors, categories } };
  } catch (error) {
    console.error('❌ Error in getServerSideProps for author listing:', error);
    return { props: { authors: [], categories: [] } };
  }
};