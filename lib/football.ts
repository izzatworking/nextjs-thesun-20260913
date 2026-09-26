const API_HOST = process.env.FOOTBALL_API_HOST || 'v3.football.api-sports.io';
const API_KEY = process.env.FOOTBALL_API_KEY || '';
const LEAGUE_ID = Number(process.env.FOOTBALL_LEAGUE_ID || 1);
const SEASON = Number(process.env.FOOTBALL_SEASON || 2022);

interface FootballTeam {
  id: number;
  name: string;
  logo: string;
}

interface FootballFixture {
  id: number;
  date: string;
  status: string;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
  homeGoals: number | null;
  awayGoals: number | null;
  round: string;
}

interface StandingTeam {
  rank: number;
  team: FootballTeam;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  points: number;
  group: string;
}

async function fetchApi(endpoint: string, params: Record<string, string>) {
  const url = new URL(`https://${API_HOST}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': API_KEY,
    },
  });
  return res.json();
}

export async function getWCFixtures(): Promise<{
  finished: FootballFixture[];
  upcoming: FootballFixture[];
}> {
  try {
    const json = await fetchApi('fixtures', {
      league: String(LEAGUE_ID),
      season: String(SEASON),
    });

    const fixtures: FootballFixture[] = (json.response || []).map((f: any) => ({
      id: f.fixture.id,
      date: f.fixture.date,
      status: f.fixture.status.long,
      homeTeam: {
        id: f.teams.home.id,
        name: f.teams.home.name,
        logo: f.teams.home.logo,
      },
      awayTeam: {
        id: f.teams.away.id,
        name: f.teams.away.name,
        logo: f.teams.away.logo,
      },
      homeGoals: f.goals.home,
      awayGoals: f.goals.away,
      round: f.league.round,
    }));

    return {
      finished: fixtures.filter((f) => f.status === 'Match Finished'),
      upcoming: fixtures.filter((f) => f.status !== 'Match Finished'),
    };
  } catch (e) {
    console.error('Failed to fetch WC fixtures:', e);
    return { finished: [], upcoming: [] };
  }
}

export async function getWCStandings(): Promise<StandingTeam[]> {
  try {
    const json = await fetchApi('standings', {
      league: String(LEAGUE_ID),
      season: String(SEASON),
    });

    const all: StandingTeam[] = [];
    const groups = json.response?.[0]?.league?.standings || [];
    for (const group of groups) {
      for (const t of group) {
        all.push({
          rank: t.rank,
          team: { id: t.team.id, name: t.team.name, logo: t.team.logo },
          played: t.all.played,
          win: t.all.win,
          draw: t.all.draw,
          lose: t.all.lose,
          goalsFor: t.all.goals.for,
          goalsAgainst: t.all.goals.against,
          goalsDiff: t.goalsDiff,
          points: t.points,
          group: t.group || group[0]?.group || '',
        });
      }
    }
    return all;
  } catch (e) {
    console.error('Failed to fetch WC standings:', e);
    return [];
  }
}

export async function getWCFixturesByGroup(): Promise<Record<string, FootballFixture[]>> {
  const { finished } = await getWCFixtures();
  const grouped: Record<string, FootballFixture[]> = {};
  for (const f of finished) {
    if (!grouped[f.round]) grouped[f.round] = [];
    grouped[f.round].push(f);
  }
  return grouped;
}
