/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, Users, Banknote, Search, Filter, ChevronDown, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";

const CATEGORIES = ["Все", "Цифровизация", "Медицина", "Экология", "Образование", "Жилищное строительство", "Наука и технологии", "Сельское хозяйство"];
const STATUSES = [
  { value: "", label: "Все статусы" },
  { value: "active", label: "Активные" },
  { value: "completed", label: "Завершённые" },
];

function ProjectCard({ project }: { project: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  project.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {project.status === "completed" ? (
                  <><CheckCircle className="w-3 h-3" /> Завершён</>
                ) : (
                  <><Clock className="w-3 h-3" /> Активный</>
                )}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{project.category}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-snug">{project.title}</h3>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-700">{project.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{project.region}</span>
          <span className="mx-1">·</span>
          <span>{project.start_year}–{project.end_year}</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{project.description}</p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {project.budget_mln && (
            <div className="flex items-center gap-1 text-gray-500">
              <Banknote className="w-4 h-4" />
              <span>{(project.budget_mln / 1000).toFixed(1)} млрд ₽</span>
            </div>
          )}
          {project.participants > 0 && (
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-4 h-4" />
              <span>{project.participants.toLocaleString("ru-RU")} участников</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-4 hover:text-blue-800"
        >
          {expanded ? "Скрыть" : "Подробнее"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Полное описание</p>
            <p className="text-sm text-gray-700">{project.description}</p>
          </div>
          {project.result && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Результаты</p>
              <p className="text-sm text-emerald-800">{project.result}</p>
            </div>
          )}
          {project.goal_title && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">{project.goal_icon}</span>
              <span>Нацпроект: <strong>{project.goal_title}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [category, setCategory] = useState("Все");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const params: Record<string, string> = {};
  if (category !== "Все") params.category = category;
  if (status) params.status = status;
  if (search) params.search = search;

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", params],
    queryFn: () => api.getProjects(params),
  });

  const totalBudget = projects?.reduce((s: number, p: any) => s + (p.budget_mln || 0), 0) || 0;
  const totalParticipants = projects?.reduce((s: number, p: any) => s + (p.participants || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">База региональных проектов</h1>
          </div>
          <p className="text-orange-100 text-lg mt-2">Успешные инициативы регионов России в реализации национальных целей</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats summary */}
        {!isLoading && projects && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Проектов", value: projects.length },
              { label: "Общий бюджет", value: (totalBudget / 1000).toFixed(0) + " млрд ₽" },
              { label: "Участников", value: totalParticipants > 1000 ? (totalParticipants / 1000).toFixed(0) + "K" : totalParticipants },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по проектам..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-48 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : projects?.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Проекты не найдены</p>
            <p className="text-sm">Попробуйте изменить фильтры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects?.map((p: any) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}

        {/* Submit CTA */}
        <div className="mt-10 bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
          <ExternalLink className="w-8 h-8 mx-auto mb-3 text-orange-500" />
          <h3 className="font-bold text-gray-900 mb-2">Есть успешный региональный проект?</h3>
          <p className="text-sm text-gray-600 mb-4">Поделитесь опытом — ваша инициатива может стать образцом для других регионов</p>
          <a
            href="/forum"
            className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-400 transition-colors text-sm"
          >
            Рассказать на форуме
          </a>
        </div>
      </div>
    </div>
  );
}
