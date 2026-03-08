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
            <span className="mr-4">Sezona dostupno</span>
            <span className="font-bold border border-pub-orange px-2 py-1 rounded-full text-pub-orange">
              {league.seasons.length}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
