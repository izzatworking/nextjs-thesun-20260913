import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getCategories, getPostsByCategory, getPostUrl } from '../lib/wordpress';
import { getWCFixtures, getWCStandings } from '../lib/football';
import { WPPostWithMedia, WPCategory } from '../types/wordpress';
import Layout from '../components/layout/Layout';
import React from 'react';

interface Props {
  categories: WPCategory[];
  fixtures: { finished: any[]; upcoming: any[] };
  standings: any[];
  sportsPosts: WPPostWithMedia[];
}

export default function FixturesWC({ categories, fixtures, sportsPosts }: Props) {
  const upcoming = fixtures?.upcoming || [];
  const grouped: Record<string, any[]> = {};
  for (const r of upcoming) {
    const round = r.round || 'Other';
    if (!grouped[round]) grouped[round] = [];
    grouped[round].push(r);
  }

  return (
    <Layout
      title="World Cup 2026 Fixtures | The Sun Malaysia"
      description="FIFA World Cup 2026 — full upcoming fixtures"
      categories={categories}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <span className="text-white font-black text-sm uppercase tracking-widest">World Cup 2026 — Fixtures</span>
            </div>
            <Link href="/wcpage" className="text-[10px] text-white/70 hover:text-white uppercase tracking-wider font-semibold transition-colors">
              ← Back
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">📅</span>
              <p className="text-white/40 text-sm mt-4">No upcoming fixtures</p>
            </div>
          ) : (
            Object.entries(grouped).map(([round, matches]) => (
              <div key={round} className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span className="text-sky-300 text-xs font-bold uppercase tracking-widest">{round}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-sky-500/30 to-transparent" />
                </div>
                <div className="space-y-2">
                  {matches.map((m: any, i: number) => (
                    <div key={m.id || i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-blue-500/10 hover:border-sky-400/30 transition-all">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        {m.homeTeam?.logo && <img src={m.homeTeam.logo} alt="" className="w-5 h-5 object-contain" />}
                        <span className="text-white text-sm font-semibold">{m.homeTeam?.name || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest whitespace-nowrap">VS</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-white text-sm font-semibold">{m.awayTeam?.name || 'TBD'}</span>
                        {m.awayTeam?.logo && <img src={m.awayTeam.logo} alt="" className="w-5 h-5 object-contain" />}
                      </div>
                      {m.date && (
                        <span className="text-[10px] text-white/30 whitespace-nowrap">
                          {new Date(m.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await getCategories();
  const sportsCat = categories.find((c) => c.slug === 'sports' || c.name.toLowerCase() === 'sports');
  const sportsPosts = sportsCat ? await getPostsByCategory(sportsCat.id, 10) : [];
  const fixtures = await getWCFixtures();
  const standings = await getWCStandings();

  return {
    props: { categories, fixtures, standings, sportsPosts },
  };
};
