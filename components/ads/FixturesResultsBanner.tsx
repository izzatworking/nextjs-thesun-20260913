import React, { useState } from 'react';

interface FixturesResultsBannerProps {
  fixtures: { finished: any[]; upcoming: any[] };
}

export const FixturesResultsBanner: React.FC<FixturesResultsBannerProps> = ({ fixtures }) => {
  const [tab, setTab] = useState<'results' | 'fixtures'>('results');
  const items = tab === 'results' ? (fixtures?.finished || []) : (fixtures?.upcoming || []);
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const visible = items.slice(page * perPage, (page + 1) * perPage);

  const nextPage = () => setPage((p) => (p + 1 >= totalPages ? 0 : p + 1));

  return (
    <div className="relative w-full h-[200px] overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-y border-blue-500/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center shrink-0">
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => { setTab('results'); setPage(0); }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  tab === 'results' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'
                }`}
              >
                Results
              </button>
              <button
                onClick={() => { setTab('fixtures'); setPage(0); }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  tab === 'fixtures' ? 'bg-sky-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'
                }`}
              >
                Fixtures
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {visible.length > 0 ? visible.map((m: any, i: number) => {
              const t1 = m.homeTeam?.name || m.team1 || 'TBD';
              const t2 = m.awayTeam?.name || m.team2 || 'TBD';
              const s1 = m.homeGoals ?? m.score1;
              const s2 = m.awayGoals ?? m.score2;
              const logo1 = m.homeTeam?.logo;
              const logo2 = m.awayTeam?.logo;
              const isResult = tab === 'results' && s1 != null;
              return (
                <div key={m.id || `${tab}-${i}`} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-3 py-2 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {logo1 && <img src={logo1} alt="" className="w-4 h-4 object-contain shrink-0" />}
                    <span className="text-white text-[11px] font-semibold truncate">{t1}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isResult ? (
                      <>
                        <span className="text-sm font-black text-blue-400 tabular-nums">{s1}</span>
                        <span className="text-white/20 text-[9px]">-</span>
                        <span className="text-sm font-black text-blue-400 tabular-nums">{s2}</span>
                      </>
                    ) : (
                      <span className="text-[9px] text-white/40 uppercase tracking-widest">VS</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                    <span className="text-white text-[11px] font-semibold truncate">{t2}</span>
                    {logo2 && <img src={logo2} alt="" className="w-4 h-4 object-contain shrink-0" />}
                  </div>
                </div>
              );
            }) : (
              <div className="flex-1 text-center text-white/30 text-xs py-4">
                {tab === 'results' ? 'No results yet' : 'No upcoming fixtures'}
              </div>
            )}
          </div>

          <button
            onClick={nextPage}
            className="shrink-0 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all active:scale-90"
            aria-label="Next"
          >
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
