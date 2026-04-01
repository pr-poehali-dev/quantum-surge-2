import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BarChart3, Calculator, MapPin, MessageSquare, ArrowRight, TrendingUp, Users, Building2, Target } from "lucide-react";
import { api } from "@/lib/api";

const sections = [
  {
    icon: BarChart3,
    href: "/analytics",
    title: "Аналитика целей",
    desc: "Интерактивные дашборды прогресса по 7 национальным целям развития России до 2030 года",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: Calculator,
    href: "/calculator",
    title: "Мой вклад",
    desc: "Узнайте, как ваша профессия, налоги, волонтёрство и семья влияют на достижение национальных целей",
    color: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: MapPin,
    href: "/projects",
    title: "Проекты регионов",
    desc: "База успешных региональных инициатив — от умных городов до экологических программ",
    color: "from-orange-500 to-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    icon: MessageSquare,
    href: "/forum",
    title: "Форум стратегий",
    desc: "Обсуждение лучших практик развития регионов с экспертами и профессионалами",
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

const goals = [
  { icon: "❤️", title: "Здоровье и долголетие", progress: 68 },
  { icon: "🎓", title: "Образование", progress: 72 },
  { icon: "🏘️", title: "Комфортная среда", progress: 61 },
  { icon: "💼", title: "Достойный труд", progress: 55 },
  { icon: "💻", title: "Цифровизация", progress: 67 },
  { icon: "🌿", title: "Экология", progress: 58 },
  { icon: "🚀", title: "Технологии", progress: 42 },
];

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6">
              <Target className="w-4 h-4" />
              <span>Национальные цели развития до 2030</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Россия 2030:<br />
              <span className="text-blue-200">Портал развития</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Отслеживайте прогресс национальных целей, изучайте успешные региональные проекты, рассчитывайте личный вклад в развитие страны и участвуйте в стратегических дискуссиях
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/analytics"
                className="flex items-center gap-2 bg-white text-blue-800 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Смотреть аналитику
              </Link>
              <Link
                to="/calculator"
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-500 border border-blue-400 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Мой вклад
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Target, label: "Национальных целей", value: stats?.goals ?? 7, color: "text-blue-600" },
              { icon: Building2, label: "Региональных проектов", value: stats?.projects ?? 8, color: "text-orange-600" },
              { icon: MessageSquare, label: "Тем на форуме", value: stats?.forum_topics ?? 6, color: "text-purple-600" },
              { icon: Users, label: "Участников проектов", value: stats ? (stats.participants / 1000).toFixed(0) + "K+" : "1M+", color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Разделы портала</h2>
          <p className="text-gray-600 text-lg">Всё необходимое для понимания и участия в развитии страны</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              to={s.href}
              className={`group flex gap-5 p-6 rounded-2xl border ${s.border} ${s.bg} hover:shadow-md transition-all`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Goals progress overview */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Прогресс национальных целей</h2>
              <p className="text-gray-600 mt-1">Ключевые показатели на пути к 2030 году</p>
            </div>
            <Link to="/analytics" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm">
              Подробнее <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {goals.map((g) => (
              <div key={g.title} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{g.icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{g.title}</span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Прогресс</span>
                  <span className="text-sm font-bold text-gray-800">{g.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Рассчитайте свой вклад в развитие страны</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Узнайте, как ваша работа, налоги, волонтёрство и семья влияют на достижение 7 национальных целей России
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            Рассчитать вклад
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Россия 2030</span>
            </div>
            <p className="text-sm text-center">Портал мониторинга национальных целей развития Российской Федерации</p>
            <div className="flex gap-4 text-sm">
              <Link to="/analytics" className="hover:text-white transition-colors">Аналитика</Link>
              <Link to="/projects" className="hover:text-white transition-colors">Проекты</Link>
              <Link to="/forum" className="hover:text-white transition-colors">Форум</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
