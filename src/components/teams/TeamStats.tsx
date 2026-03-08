"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TeamStatsData {
  seasonId: number;
  seasonName: string;
  teamId: number;
  teamName: string;
  avgPoints: string;
  totalEvents: number;
}

interface TeamStatsProps {
  teamId: number;
}

const COLORS = ["#F97316", "#FB923C", "#FDBA74", "#FED7AA"];

export default function TeamStats({ teamId }: TeamStatsProps) {
  const [stats, setStats] = useState<TeamStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/team/${teamId}/stats`, {
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Greška pri učitavanju statistike");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepoznata greška");
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchStats();
    }
  }, [teamId]);

  if (loading) {
    return (
      <div className="bg-transparent backdrop-blur rounded-2xl p-8 border border-pub-gray/50">
        <div className="animate-pulse flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-pub-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60 mt-4">Učitavanje statistike...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-transparent backdrop-blur rounded-2xl p-8 border border-red-500/50">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="bg-transparent backdrop-blur rounded-2xl p-8 border border-pub-gray/50">
        <p className="text-white/60 text-center">
          Nema dostupne statistike za ovaj tim.
        </p>
      </div>
    );
  }

  const chartData = stats.map((stat) => ({
    season: stat.seasonName,
    avgPoints: parseFloat(stat.avgPoints).toFixed(1),
    totalEvents: stat.totalEvents,
  }));

  const totalPoints = stats.reduce(
    (acc, stat) => acc + parseFloat(stat.avgPoints) * stat.totalEvents,
    0
  );
  const totalEvents = stats.reduce((acc, stat) => acc + stat.totalEvents, 0);
  const overallAvg = totalEvents > 0 ? (totalPoints / totalEvents).toFixed(1) : "0";

  return (
    <div className="bg-transparent backdrop-blur rounded-2xl p-8 border border-pub-gray/50">
      <h2 className="text-2xl font-bold text-white mb-6">Statistika tima</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-pub-dark/50 rounded-xl p-4 border border-pub-gray/30">
          <div className="text-3xl font-bold text-pub-orange">{totalEvents}</div>
          <div className="text-sm text-white/60">Ukupno događaja</div>
        </div>
        <div className="bg-pub-dark/50 rounded-xl p-4 border border-pub-gray/30">
          <div className="text-3xl font-bold text-pub-orange">{overallAvg}</div>
          <div className="text-sm text-white/60">Prosečni poeni</div>
        </div>
        <div className="bg-pub-dark/50 rounded-xl p-4 border border-pub-gray/30">
          <div className="text-3xl font-bold text-pub-orange">{stats.length}</div>
          <div className="text-sm text-white/60">Odigrane sezone</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-pub-dark/30 rounded-xl p-6 border border-pub-gray/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            Prosečni poeni po sezoni
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="season"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
                domain={[0, 50]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F97316" }}
                itemStyle={{ color: "#FFFFFF" }}
              />
              <Bar dataKey="avgPoints" name="Prosečni poeni" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-pub-dark/30 rounded-xl p-6 border border-pub-gray/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            Broj događaja po sezoni
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="season"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F97316" }}
                itemStyle={{ color: "#FFFFFF" }}
              />
              <Bar dataKey="totalEvents" name="Broj događaja" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Pregled po sezonama</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-pub-gray/30">
                <th className="py-3 px-4 text-white/60 font-medium">Sezona</th>
                <th className="py-3 px-4 text-white/60 font-medium text-center">
                  Događaji
                </th>
                <th className="py-3 px-4 text-white/60 font-medium text-center">
                  Prosek poena
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => (
                <tr
                  key={stat.seasonId}
                  className="border-b border-pub-gray/20 hover:bg-pub-gray/10 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-white">{stat.seasonName}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-white/80">
                    {stat.totalEvents}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-pub-orange font-semibold">
                      {parseFloat(stat.avgPoints).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
