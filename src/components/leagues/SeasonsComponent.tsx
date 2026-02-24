import { Season, SpecificLeague, Standing } from "@/constants/types";
import { useEffect, useState } from "react";

type SeasonsProps = {
  league: SpecificLeague;
};

export default function SeasonsComponent({ league }: SeasonsProps) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  const fetchStandings = async (seasonId: number) => {
    setStandingsLoading(true);
    try {
      const response = await fetch(`/api/seasons/${seasonId}/standings`, {
        credentials: "include",
      });
      const data = await response.json();
      setStandings(data);
    } catch (err) {
      console.error("Greška pri dohvatanju tabele:", err);
    } finally {
      setStandingsLoading(false);
    }
  };

  useEffect(() => {
    if (league.seasons.length > 0) {
      setSelectedSeason(league.seasons[0]);
      fetchStandings(league.seasons[0].id);
    }
  }, [league]);

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
    fetchStandings(season.id);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-pub-orange p-6 sticky top-24">
          <h2 className="text-xl font-bold text-black mb-4">Sezone</h2>

          {league.seasons.length > 0 ? (
            <div className="space-y-2">
              {league.seasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() => handleSeasonChange(season)}
                  className={`w-full text-left p-3 rounded-lg transition font-semibold ${
                    selectedSeason?.id === season.id
                      ? "bg-pub-orange text-white shadow-lg"
                      : "bg-pub-beige text-black hover:bg-orange-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{season.name}</span>
                    {season.isActive && (
                      <div className="relative w-2.5 h-2.5 bg-green-500 rounded-full">
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nema dostupnih sezona</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        {selectedSeason ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-pub-orange overflow-hidden">
            <div className="bg-linear-to-r from-pub-orange to-orange-400 text-white p-6">
              <h2 className="text-2xl font-bold">{selectedSeason.name}</h2>
              {selectedSeason.isActive && (
                <p className="text-orange-100">Sezona je trenutno aktivna</p>
              )}
            </div>

            <div className="p-6">
              {standingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500">Učitavanje tabele...</p>
                </div>
              ) : standings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-pub-orange">
                        <th className="text-left py-3 px-4 font-bold text-pub-orange">
                          Mesto
                        </th>
                        <th className="text-left py-3 px-4 font-bold text-pub-orange">
                          Tim
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((standing, index) => (
                        <tr
                          key={standing.teamId}
                          className="border-b border-pub-orange/10 hover:bg-pub-beige/50 transition"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              {/* Medal/Position */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-3 ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                      ? "bg-gray-400"
                                      : index === 2
                                        ? "bg-orange-600"
                                        : "bg-gray-300"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <span className="font-bold text-black">
                                {index + 1}.
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-black font-semibold">
                            {standing.teamName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Nema dostupnih rezultata za ovu sezonu
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-pub-orange p-12 flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Izaberite sezonu da vidite tabelu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
