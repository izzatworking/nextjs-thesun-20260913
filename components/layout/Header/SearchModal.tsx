'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { searchPosts, getCategories, getPostsByCategory, setCategoryCache } from '@/lib/wordpress';
import type { WPPostWithMedia, WPCategory, WPAuthor } from '@/types/wordpress';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'articles' | 'authors' | 'categories';

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabType>('articles');
  const [results, setResults] = useState<any[]>([]);
  const [authors, setAuthors] = useState<WPAuthor[]>([]);
  const [categoriesList, setCategoriesList] = useState<WPCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryPosts, setCategoryPosts] = useState<WPPostWithMedia[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const getPostSlug = (post: any): string => {
    return post.slug || '';
  };

  const getArticlePath = (post: any): string => {
    if (post.categories && post.categories.length > 0 && categoriesList.length > 0) {
      const cat = categoriesList.find((c: any) => c.id === post.categories[0]);
      if (cat) {
        const slug = cat.slug.toLowerCase().replace(/&/g, '-and-').replace(/\s+/g, '-').replace(/[^\w\-]/g, '') || 'news';
        return `/${slug}/${post.slug}`;
      }
    }
    return `/posts/${post.slug}`;
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setAuthors([]);
      setSelectedCategory(null);
      setCategoryPosts([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) getCategories().then(cats => { setCategoriesList(cats); setCategoryCache(cats); }).catch(() => {});
  }, [isOpen]);

  const doSearchArticles = useCallback(async (term: string) => {
    const t = term.trim().toLowerCase();
    if (t.length < 1) { setResults([]); return; }
    setLoading(true);
    try {
      const posts = await searchPosts(t, 50);
      const words = t.split(/\s+/).filter(Boolean);
      const mapped = posts.filter((p: any) => {
        const title = (p.title?.rendered || '').toLowerCase();
        return words.some(w => title.includes(w));
      });
      setResults(mapped);
    } catch (e) { console.error('Search error:', e); setResults([]); } finally { setLoading(false); }
  }, []);

  const doSearchAuthors = useCallback(async (term: string) => {
    const t = term.trim().toLowerCase();
    if (t.length < 1) { setAuthors([]); return; }
    setLoading(true);
    try {
      const posts = await searchPosts(t, 50);
      const seen = new Set<number>();
      const found: any[] = [];
      posts.forEach((p: any) => {
        (p.authors || []).forEach((a: any) => {
          const id = a.term_id || a.user_id || 0;
          const name = (a.display_name || '').toLowerCase();
          if (id && !seen.has(id) && name.includes(t)) {
            seen.add(id);
            found.push(a);
          }
        });
      });
      setAuthors(found);
    } catch { setAuthors([]); } finally { setLoading(false); }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (tab === 'articles') doSearchArticles(val);
      else if (tab === 'authors') doSearchAuthors(val);
    }, 400);
  };

  const handleTabChange = (t: TabType) => {
    setTab(t);
    setQuery('');
    setResults([]);
    setAuthors([]);
    setSelectedCategory(null);
    setCategoryPosts([]);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCategorySelect = async (catId: number) => {
    setSelectedCategory(catId);
    setCatLoading(true);
    try {
      const posts = await getPostsByCategory(catId, 20);
      setCategoryPosts(posts);
    } catch { setCategoryPosts([]); } finally { setCatLoading(false); }
    setQuery('');
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCategories = query.trim().length >= 2
    ? categoriesList.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : categoriesList;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-3 sm:mx-4 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button onClick={() => handleTabChange('articles')} className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === 'articles' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-400 hover:text-gray-600'}`}>Articles</button>
          <button onClick={() => handleTabChange('authors')} className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === 'authors' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-400 hover:text-gray-600'}`}>Authors</button>
          <button onClick={() => handleTabChange('categories')} className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === 'categories' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-400 hover:text-gray-600'}`}>Categories</button>
        </div>

        {/* Search input */}
        <div className="flex items-center border-b border-gray-50">
          <svg className="w-4 h-4 text-gray-300 ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={tab === 'articles' ? 'Search articles...' : tab === 'authors' ? 'Search authors...' : 'Search categories...'}
            className="w-full py-3 px-3 text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none"
          />
          <button onClick={onClose} className="mr-3 p-1.5 rounded-md hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="p-4 space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Tab */}
          {tab === 'articles' && !loading && (
            <>
              {query.trim().length >= 2 && results.length === 0 && (
                <div className="text-center py-10 text-gray-400"><p className="text-sm">No articles found</p></div>
              )}
              {results.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {results.map(post => (
                    <Link key={post.id} href={getArticlePath(post)} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                      {post.featured_media_url ? (
                        <img src={post.featured_media_url} alt="" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" /></svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">{new Date(post.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-red-600 transition-colors" dangerouslySetInnerHTML={{ __html: post.title?.rendered || '' }} />
                      </div>
                      <svg className="w-4 h-4 text-gray-200 group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                </div>
              )}
              {query.trim().length < 2 && (
                <div className="text-center py-10 text-gray-300">
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p className="text-sm">Type to search articles</p>
                </div>
              )}
            </>
          )}

          {/* Authors Tab */}
          {tab === 'authors' && !loading && (
            <>
              {query.trim().length >= 2 && authors.length === 0 && (
                <div className="text-center py-10 text-gray-400"><p className="text-sm">No authors found</p></div>
              )}
              {authors.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {authors.map(author => (
                    <Link key={author.user_id} href={`/author/${author.slug}`} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {author.avatar_url?.url ? (
                          <img src={author.avatar_url.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-medium text-gray-500">{(author.display_name || 'A')[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-red-600 transition-colors truncate">{author.display_name}</p>
                        {author.job_title && <p className="text-xs text-gray-400 truncate">{author.job_title}</p>}
                      </div>
                      <svg className="w-4 h-4 text-gray-200 group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                </div>
              )}
              {query.trim().length < 2 && (
                <div className="text-center py-10 text-gray-300">
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p className="text-sm">Type to search authors</p>
                </div>
              )}
            </>
          )}

          {/* Categories Tab */}
          {tab === 'categories' && !loading && (
            <div>
              {selectedCategory === null ? (
                <>
                  {query.trim().length >= 2 && filteredCategories.length === 0 && (
                    <div className="text-center py-10 text-gray-400"><p className="text-sm">No categories found</p></div>
                  )}
                  {filteredCategories.length > 0 && (
                    <div className="divide-y divide-gray-50">
                      {filteredCategories.map((cat: WPCategory) => (
                        <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      ))}
                    </div>
                  )}
                  {query.trim().length < 2 && (
                    <div className="text-center py-10 text-gray-300">
                      <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <p className="text-sm">Type to filter or select a category</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-50">
                    <button onClick={() => { setSelectedCategory(null); setCategoryPosts([]); }} className="p-1 rounded-md hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-xs font-medium text-gray-600">{categoriesList.find(c => c.id === selectedCategory)?.name}</span>
                  </div>
                  {catLoading ? (
                    <div className="flex items-center justify-center py-10"><div className="w-5 h-5 border-3 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {categoryPosts.map(post => (
                        <Link key={post.id} href={getArticlePath(post)} onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                          {post.featured_media_url ? (
                            <img src={post.featured_media_url} alt="" className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" /></svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">{new Date(post.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</p>
                            <p className="text-sm font-medium text-gray-800 truncate group-hover:text-red-600 transition-colors" dangerouslySetInnerHTML={{ __html: post.title?.rendered || '' }} />
                          </div>
                          <svg className="w-4 h-4 text-gray-200 group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
