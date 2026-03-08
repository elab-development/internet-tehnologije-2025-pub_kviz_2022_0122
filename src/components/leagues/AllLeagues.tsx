import Link from "next/link";
import { League } from "@/constants/types";

type LeagueTableProps = {
  leagues: League[];
};

export default function AllLeagues({ leagues }: LeagueTableProps) {
  return (
    <div className="min-h-screen px-4 py-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Lige
          </h1>
          <p className="text-xl text-white/70 max-w-xl mx-auto">
            Istraži sve lige, njihove sezone i leaderboard timova
          </p>
        </div>

        {leagues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leagues.map((league) => (
              <Link href={`/league/${league.id}`} key={league.id}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:border-pub-orange/60 hover:shadow-[0_0_40px_rgba(255,120,40,0.25)] hover:-translate-y-1 cursor-pointer">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear from-pub-orange/10 via-transparent to-transparent" />

                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-linear from-pub-orange to-orange-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition">
                    {league.name.charAt(0)}
                  </div>

                  <h2 className="relative z-10 text-2xl font-semibold text-white mt-6 group-hover:text-pub-orange transition">
                    {league.name}
                  </h2>

                  <p className="relative z-10 text-white/70 mt-2 leading-relaxed">
                    Pregled sezona, timova i trenutnog poretka u ligi.
                  </p>

                  <div className="relative z-10 my-6 h-px bg-white/10" />

                  <div className="relative z-10 flex items-center text-pub-orange font-semibold tracking-wide group-hover:translate-x-1 transition">
                    Pogledaj ligu
                    <svg
                      className="w-5 h-5 ml-2 transition group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-2xl text-white/60">
              Trenutno nema dostupnih liga
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
