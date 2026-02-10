import type { TeamResponse } from "@/constants/types";

export default function TeamAchievements({
  teamData,
}: {
  teamData: TeamResponse | null;
}) {
  if (!teamData?.id) {
    return null;
  }
  return (
    <div className="border-2 border-pub-orange bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
        Dostignuća
      </h2>

      <div className="space-y-4">
        <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-300">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-semibold text-black">Prvak lige</div>
          <div className="text-sm text-gray-600">3 uzastopne pobede</div>
        </div>

        <div className="p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-300">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-semibold text-black">Preciznost</div>
          <div className="text-sm text-gray-600">95% tačnost ovaj mesec</div>
        </div>

        <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-300">
          <div className="text-3xl mb-2">⚡</div>
          <div className="font-semibold text-black">Brza ekipa</div>
          <div className="text-sm text-gray-600">Rekord: 45s po kvizu</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold mb-3 text-black">Poslednja aktivnost</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Pobeda u "Istorija kvizu"
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Ana S. pridružila timu
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Novo dostignuće otkljucano
          </div>
        </div>
      </div>
    </div>
  );
}