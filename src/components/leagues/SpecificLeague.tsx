import { SpecificLeague } from "@/constants/types";
type Props = {
  league: SpecificLeague;
};
export default function SpecificLeagueComponent({ league }: Props) {
  return (
    <div className="bg-transparent rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">{league.name}</h1>
          <p className="text-white/80">
            {league.seasons.length} sezona dostupno
          </p>
        </div>
        <div className="w-20 h-20 bg-linear-to-br from-pub-orange to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
          {league.name.charAt(0)}
        </div>
      </div>
    </div>
  );
}
