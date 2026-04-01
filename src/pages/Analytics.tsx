/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarRadiusAxis
} from "recharts";
import { TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";

const colorMap: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  emerald: "#10b981",
  orange: "#f97316",
};

const YEARS = [2020, 2021, 2022, 2023, 2024];

function ProgressRing({ value, target, color }: { value: number; target: number; color: string }) {
  const pct = Math.min((value / target) * 100, 100);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const hex = colorMap[color] || "#3b82f6";
  return (
    <svg className="w-24 h-24" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={hex} strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x="50" y="54" textAnchor="middle" fill={hex} fontSize="16" fontWeight="bold">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

function GoalCard({ goal, expanded, onToggle }: { goal: any; expanded: boolean; onToggle: () => void }) {
  const { data: detail } = useQuery({
    queryKey: ["goal", goal.id],
    queryFn: () => api.getGoal(goal.id),
    enabled: expanded,
  });

  const pct = Math.min((goal.current_value / goal.target_value) * 100, 100);
  const hex = colorMap[goal.color] || "#3b82f6";

  // Build chart data from indicators
  const chartData = YEARS.map((year) => {
    const row: Record<string, any> = { year: year.toString() };
    if (detail?.indicators) {
      detail.indicators.forEach((ind: any, i: number) => {
        const key = `value_${year}`;
        row[`ind_${i}`] = ind[key];
      });
    }
    return row;
  });

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ borderTop: `3px solid ${hex}` }}
    >
      <button className="w-full text-left p-5" onClick={onToggle}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ProgressRing value={goal.current_value} target={goal.target_value} color={goal.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{goal.icon}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ background: hex }}
              >
                {goal.category}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-snug">{goal.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{goal.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div>
                <span className="text-gray-400">Текущее: </span>
                <span className="font-semibold text-gray-900">{goal.current_value} {goal.unit}</span>
              </div>
              <div>
                <span className="text-gray-400">Цель 2030: </span>
                <span className="font-semibold" style={{ color: hex }}>{goal.target_value} {goal.unit}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 text-gray-400">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Прогресс к цели</span>
            <span>{Math.round(pct)}% ({goal.deadline_year})</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: hex }}
            />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && detail && (
        <div className="border-t border-gray-100 px-5 pb-5">
          {detail.indicators && detail.indicators.length > 0 && (
            <div className="mt-4 space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Ключевые индикаторы
              </h4>
              {detail.indicators.map((ind: any) => {
                const years = YEARS;
                const data = years.map((y) => ({
                  year: y.toString(),
                  value: ind[`value_${y}`],
                })).filter((d) => d.value != null);
                const last = data[data.length - 1]?.value;
                const prev = data[data.length - 2]?.value;
                const isUp = last > prev;
                const isBetterUp = ind.trend === "up";
                const isGood = isBetterUp ? isUp : !isUp;

                return (
                  <div key={ind.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{ind.name}</span>
                      <div className="flex items-center gap-1">
                        {isGood ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${isGood ? "text-emerald-600" : "text-red-600"}`}>
                          {last} {ind.unit}
                        </span>
                      </div>
                    </div>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(v) => [`${v} ${ind.unit}`, ind.name]}
                            contentStyle={{ fontSize: 12 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={hex}
                            strokeWidth={2}
                            dot={{ fill: hex, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Цель к 2030: {ind.target_2030} {ind.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Analytics() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: api.getGoals,
  });

  // Radar data
  const radarData = goals?.map((g: any) => ({
    goal: g.icon + " " + g.title.split(" ").slice(0, 2).join(" "),
    value: Math.min((g.current_value / g.target_value) * 100, 100),
    fullMark: 100,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Аналитика национальных целей</h1>
          <p className="text-blue-100 text-lg">Прогресс достижения 7 национальных целей развития России до 2030 года</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Radar overview */}
        {!isLoading && radarData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10 shadow-sm">
            <h2 className="font-bold text-gray-900 text-xl mb-4">Общий прогресс по всем целям</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="goal" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Прогресс" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radarData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                    <YAxis dataKey="goal" type="category" width={120} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${Math.round(Number(v))}%`, "Прогресс"]} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Goal cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-48 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals?.map((goal: any) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                expanded={expandedId === goal.id}
                onToggle={() => setExpandedId(expandedId === goal.id ? null : goal.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}