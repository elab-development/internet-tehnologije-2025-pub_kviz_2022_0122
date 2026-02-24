import Link from "next/link";
import { League } from "@/constants/types";

type LeagueTableProps = {
  leagues: League[];
};

export default function AllLeagues({ leagues }: LeagueTableProps) {
  return (
    <div className="min-h-screen px-4 py-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Lige</h1>
          <p className="text-xl text-white/80">
            Pronađi ligu, pogledaj sezone i vodstvo
          </p>
        </div>

        {leagues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leagues.map((league) => (
              <Link href={`/league/${league.id}`} key={league.id}>
                <div className="group h-full bg-white/70 rounded-2xl shadow-lg border-2 border-pub-orange/20 p-8 hover:border-pub-orange hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <div className="w-16 h-16 bg-linear-to-br from-pub-orange to-orange-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 group-hover:scale-110 transition-transform">
                    {league.name.charAt(0)}
                  </div>

                  <h2 className="text-2xl font-bold text-pub-blue mb-2 group-hover:text-pub-orange transition">
                    {league.name}
                  </h2>

                  <div className="mb-6">
                    <p className="text-pub-blue/80">
                      Pronađi sve sezone i leaderboard
                    </p>
                  </div>

                  <div className="flex items-center text-pub-orange font-semibold group-hover:translate-x-2 transition-transform">
                    Pogledaj ligu
                    <svg
                      className="w-5 h-5 ml-2"
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
          <div className="text-center py-16">
            <p className="text-2xl text-white/80">Nema dostupnih liga</p>
          </div>
        )}
      </div>
    </div>
  );
}
