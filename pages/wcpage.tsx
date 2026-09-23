import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getPostsByCategory, getCategories, getPostUrl, setCategoryCache } from '../lib/wordpress';
import { getWCFixtures, getWCStandings } from '../lib/football';
import { WPPostWithMedia, WPCategory } from '../types/wordpress';
import Layout from '../components/layout/Layout';
import { FixturesResultsBanner } from '../components/ads/FixturesResultsBanner';

function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&#8217;/g, "'").replace(/&amp;/g, '&').trim();
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
}

interface WCPageProps {
  sportsPosts: WPPostWithMedia[];
  categories: WPCategory[];
  fixtures: { finished: any[]; upcoming: any[] };
  standings: any[];
}

function StoryCard({ post, categories }: { post: WPPostWithMedia, categories: WPCategory[] }) {
  return (
    <Link href={getPostUrl(post, categories)} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white/5 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500">
        <div className="aspect-[16/10] overflow-hidden">
          {post.featured_media_url ? (
            <img
              src={post.featured_media_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-sky-900/20 flex items-center justify-center">
              <span className="text-white/20 text-4xl">⚽</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="inline-block px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[9px] font-bold uppercase tracking-widest mb-1.5">
            WC 2026
          </div>
          <h3
            className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-blue-300 transition-colors drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: cleanText(post.title.rendered) }}
          />
          <span className="text-[9px] text-white/40 mt-1 block">{timeAgo(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}

function MatchCard({ match, type }: { match: any; type: 'result' | 'fixture' }) {
  const t1 = match.homeTeam?.name || match.team1 || 'TBD';
  const t2 = match.awayTeam?.name || match.team2 || 'TBD';
  const s1 = match.homeGoals ?? match.score1;
  const s2 = match.awayGoals ?? match.score2;
  const logo1 = match.homeTeam?.logo;
  const logo2 = match.awayTeam?.logo;
  const isResult = type === 'result' && s1 != null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-blue-500/10 hover:border-blue-400/30 transition-all">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {logo1 && <img src={logo1} alt="" className="w-5 h-5 object-contain shrink-0" />}
        <span className="text-white text-sm font-semibold truncate">{t1}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {isResult ? (
          <>
            <span className="text-base font-black text-blue-400 tabular-nums">{s1}</span>
            <span className="text-white/20 text-[10px]">-</span>
            <span className="text-base font-black text-blue-400 tabular-nums">{s2}</span>
          </>
        ) : (
          <span className="text-[10px] text-white/30 uppercase tracking-widest whitespace-nowrap">VS</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="text-white text-sm font-semibold truncate">{t2}</span>
        {logo2 && <img src={logo2} alt="" className="w-5 h-5 object-contain shrink-0" />}
      </div>
    </div>
  );
}

export default function WCPage({ sportsPosts, categories, fixtures, standings }: WCPageProps) {
  const results = (fixtures?.finished || []).slice(0, 3);
  const upcoming = (fixtures?.upcoming || []).slice(0, 3);

  const row1Posts = sportsPosts.slice(0, 1);
  const row2Posts = sportsPosts.slice(1, 4);
  const row3Posts = sportsPosts.slice(4, 7);

  return (
    <Layout
      title="World Cup 2026 | The Sun Malaysia"
      description="FIFA World Cup 2026 — latest news, results, fixtures, and countdown"
      categories={categories}
    >
      <FixturesResultsBanner fixtures={fixtures} />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        {/* === HEADER STRIP === */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <span className="text-white font-black text-sm uppercase tracking-widest">World Cup 2026</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/70 uppercase tracking-wider font-semibold">
              <span>48 Nations</span>
              <span className="w-px h-3 bg-white/20" />
              <span>16 Cities</span>
              <span className="w-px h-3 bg-white/20" />
              <span>1 Champion</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

          {/* === NEWS + SIDEBAR (RESULTS + FIXTURES) === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — News */}
              <div className="lg:col-span-2 space-y-4">
              {row1Posts.map((post) => (
                <Link key={post.id} href={getPostUrl(post, categories)} className="group block">
                  <div className="relative overflow-hidden rounded-xl bg-white/5 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500">
                    <div className="aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
                      {post.featured_media_url ? (
                        <img
                          src={post.featured_media_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-sky-900/20 to-cyan-900/20 flex items-center justify-center">
                          <span className="text-white/20 text-6xl">⚽</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                      <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-3">
                        WC 2026
                      </div>
                      <h2
                        className="text-xl sm:text-3xl lg:text-4xl font-black text-white line-clamp-2 group-hover:text-blue-300 transition-colors drop-shadow-lg"
                        dangerouslySetInnerHTML={{ __html: cleanText(post.title.rendered) }}
                      />
                      {post.excerpt?.rendered && (
                        <p className="text-white/60 text-sm mt-2 line-clamp-2 max-w-2xl">
                          {cleanText(post.excerpt.rendered).substring(0, 150)}
                        </p>
                      )}
                      <span className="text-[10px] text-white/40 mt-3 block font-medium uppercase tracking-wider">{timeAgo(post.date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {row2Posts.map((post) => (
                  <StoryCard key={post.id} post={post} categories={categories} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {row3Posts.map((post) => (
                  <StoryCard key={post.id} post={post} categories={categories} />
                ))}
              </div>
            </div>

            {/* Right — Results + Fixtures */}
            <div className="space-y-6">
              {/* Results */}
              <div className="rounded-xl bg-white/5 border border-blue-500/10 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-blue-500/10 to-sky-500/10 border-b border-blue-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-blue-300 text-sm font-bold uppercase tracking-widest">Latest Results</span>
                  </div>
                  <Link href="/result-wc" className="text-[10px] text-blue-400 hover:text-blue-300 uppercase tracking-wider font-semibold transition-colors">
                    See All
                  </Link>
                </div>
                <div className="p-4 space-y-3">
                  {results.length > 0 ? results.map((f: any, i: number) => (
                    <MatchCard key={f.id || `r-${i}`} match={f} type="result" />
                  )) : (
                    <p className="text-white/30 text-xs text-center py-4">No results yet</p>
                  )}
                </div>
              </div>

              {/* Fixtures */}
              <div className="rounded-xl bg-white/5 border border-blue-500/10 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-b border-blue-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-300 text-sm font-bold uppercase tracking-widest">Upcoming Fixtures</span>
                  </div>
                  <Link href="/fixtures-wc" className="text-[10px] text-sky-400 hover:text-sky-300 uppercase tracking-wider font-semibold transition-colors">
                    See All
                  </Link>
                </div>
                <div className="p-3 space-y-2">
                  {upcoming.length > 0 ? upcoming.map((f: any, i: number) => (
                    <MatchCard key={f.id || `u-${i}`} match={f} type="fixture" />
                  )) : (
                    <p className="text-white/30 text-xs text-center py-4">No upcoming fixtures</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* === GROUP STANDINGS === */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">Group Standings</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from(new Set(standings.map((t: any) => t.group))).map((gn) => {
                const groupTeams = standings.filter((t: any) => t.group === gn);
                if (groupTeams.length === 0) return null;
                const topTwo = groupTeams.slice(0, 2);
                const bottomTwo = groupTeams.slice(2);
                return (
                    <div key={gn} className="rounded-xl bg-white/5 border border-blue-500/10 overflow-hidden">
                      <div className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-sky-500/10 border-b border-blue-500/10 flex items-center justify-between">
                        <h4 className="text-blue-300 font-bold text-xs uppercase tracking-widest">{gn.replace('Group ', 'Group ')}</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr className="text-white/30 uppercase tracking-wider border-b border-blue-500/5">
                              <th className="text-left px-3 py-1.5 font-medium">#</th>
                              <th className="text-left px-2 py-1.5 font-medium">Team</th>
                              <th className="text-center px-2 py-1.5 font-medium">P</th>
                              <th className="text-center px-2 py-1.5 font-medium">W</th>
                              <th className="text-center px-2 py-1.5 font-medium">D</th>
                              <th className="text-center px-2 py-1.5 font-medium">L</th>
                              <th className="text-center px-2 py-1.5 font-medium">GF</th>
                              <th className="text-center px-2 py-1.5 font-medium">Pts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupTeams.map((t: any) => (
                              <tr key={t.team.id} className={t.rank <= 2 ? 'bg-blue-500/10' : ''}>
                                <td className="px-3 py-1.5">
                                  <span className={t.rank <= 2 ? 'font-black text-blue-400' : 'font-medium text-white/40'}>{t.rank}</span>
                                </td>
                                <td className="px-2 py-1.5 flex items-center gap-1.5">
                                  {t.team.logo && <img src={t.team.logo} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />}
                                  <span className={`truncate ${t.rank <= 2 ? 'text-white font-bold' : 'text-white/70'}`}>{t.team.name}</span>
                                </td>
                                <td className="text-center px-2 py-1.5 text-white/60 tabular-nums">{t.played}</td>
                                <td className="text-center px-2 py-1.5 text-white/60 tabular-nums">{t.win}</td>
                                <td className="text-center px-2 py-1.5 text-white/60 tabular-nums">{t.draw}</td>
                                <td className="text-center px-2 py-1.5 text-white/60 tabular-nums">{t.lose}</td>
                                <td className="text-center px-2 py-1.5 text-white/60 tabular-nums">{t.goalsFor}</td>
                                <td className="text-center px-2 py-1.5">
                                  <span className={t.rank <= 2 ? 'font-black text-blue-400' : 'font-medium text-white/50'}>{t.points}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );
  const categories = await getCategories();
  setCategoryCache(categories);
  const sportsCat = categories.find((c) => c.slug === 'sports' || c.name.toLowerCase() === 'sports');
  const sportsPosts = sportsCat ? await getPostsByCategory(sportsCat.id, 10) : [];
  const fixtures = await getWCFixtures();
  const standings = await getWCStandings();

  return {
    props: {
      sportsPosts,
      categories,
      fixtures,
      standings,
    },
  };
};
