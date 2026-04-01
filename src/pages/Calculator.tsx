/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Calculator, CheckCircle, ChevronRight, ChevronLeft, Share2 } from "lucide-react";
import { api } from "@/lib/api";

const PROFESSIONS = [
  { value: "doctor", label: "Врач / медработник", weights: { health: 3, education: 1 } },
  { value: "teacher", label: "Учитель / педагог", weights: { education: 3, youth: 1 } },
  { value: "engineer", label: "Инженер / IT-специалист", weights: { digital: 3, science: 2 } },
  { value: "builder", label: "Строитель / архитектор", weights: { housing: 3, infrastructure: 1 } },
  { value: "entrepreneur", label: "Предприниматель / бизнес", weights: { economy: 3, employment: 2 } },
  { value: "scientist", label: "Учёный / исследователь", weights: { science: 3, education: 2 } },
  { value: "ecologist", label: "Эколог / природоохрана", weights: { ecology: 3, health: 1 } },
  { value: "civil_servant", label: "Государственный служащий", weights: { governance: 3, infrastructure: 1 } },
  { value: "social_worker", label: "Социальный работник", weights: { health: 2, poverty: 2 } },
  { value: "farmer", label: "Агроном / фермер", weights: { food: 3, ecology: 1 } },
  { value: "other", label: "Другая профессия", weights: {} },
];

const REGIONS = [
  "Москва", "Санкт-Петербург", "Московская область", "Краснодарский край",
  "Республика Татарстан", "Свердловская область", "Новосибирская область",
  "Нижегородская область", "Челябинская область", "Самарская область",
  "Ростовская область", "Башкортостан", "Красноярский край", "Пермский край",
  "Воронежская область", "Другой регион"
];

const EDUCATION_LEVELS = [
  { value: "secondary", label: "Среднее", score: 1 },
  { value: "vocational", label: "Среднее специальное", score: 2 },
  { value: "bachelor", label: "Бакалавриат", score: 3 },
  { value: "master", label: "Магистратура", score: 4 },
  { value: "phd", label: "Аспирантура / PhD", score: 5 },
];

const GOAL_LABELS = [
  { key: "Здоровье", icon: "❤️" },
  { key: "Образование", icon: "🎓" },
  { key: "Жильё", icon: "🏘️" },
  { key: "Экономика", icon: "💼" },
  { key: "Цифровизация", icon: "💻" },
  { key: "Экология", icon: "🌿" },
  { key: "Технологии", icon: "🚀" },
];

function calcImpact(form: any) {
  const prof = PROFESSIONS.find((p) => p.value === form.profession);
  const edLevel = EDUCATION_LEVELS.find((e) => e.value === form.education) || EDUCATION_LEVELS[0];

  const taxScore = Math.min((form.taxPaid / 100000) * 10, 30);
  const volScore = Math.min((form.volunteerHours / 50) * 10, 25);
  const childScore = Math.min(form.children * 8, 24);
  const edScore = edLevel.score * 3;

  const base = taxScore + volScore + childScore + edScore;

  // Goal-specific impacts (0-100)
  const goals: Record<string, number> = {
    Здоровье: Math.round(base * 0.6 + (prof?.weights as any)?.health * 8 || 0),
    Образование: Math.round(base * 0.5 + (prof?.weights as any)?.education * 8 || 0),
    Жильё: Math.round(base * 0.4 + (prof?.weights as any)?.housing * 8 || 0),
    Экономика: Math.round(base * 0.7 + (prof?.weights as any)?.economy * 8 || 0),
    Цифровизация: Math.round(base * 0.4 + (prof?.weights as any)?.digital * 8 || 0),
    Экология: Math.round(base * 0.3 + (prof?.weights as any)?.ecology * 8 || 0),
    Технологии: Math.round(base * 0.4 + (prof?.weights as any)?.science * 8 || 0),
  };

  // Clamp 5-95
  Object.keys(goals).forEach((k) => {
    goals[k] = Math.max(5, Math.min(95, goals[k]));
  });

  const totalScore = Math.round(Object.values(goals).reduce((a, b) => a + b, 0) / GOAL_LABELS.length);

  return { goals, totalScore };
}

function ScoreLevel({ score }: { score: number }) {
  if (score >= 75) return <span className="text-emerald-600 font-semibold">Высокий вклад 🌟</span>;
  if (score >= 50) return <span className="text-blue-600 font-semibold">Средний вклад 📈</span>;
  if (score >= 25) return <span className="text-yellow-600 font-semibold">Базовый вклад 💡</span>;
  return <span className="text-gray-500 font-semibold">Начальный уровень 🌱</span>;
}

const STEPS = ["Профессия", "Финансы", "Активность", "Результат"];

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    profession: "",
    region: "",
    taxPaid: 50000,
    volunteerHours: 0,
    children: 0,
    education: "bachelor",
  });
  const [result, setResult] = useState<{ goals: Record<string, number>; totalScore: number } | null>(null);

  const mutation = useMutation({
    mutationFn: api.submitCalculator,
  });

  const handleCalc = () => {
    const r = calcImpact(form);
    setResult(r);
    mutation.mutate({
      profession: form.profession,
      region: form.region,
      tax_paid: form.taxPaid,
      volunteer_hours: form.volunteerHours,
      children: form.children,
      education_level: form.education,
      total_score: r.totalScore,
      goals_impact: r.goals,
    });
    setStep(3);
  };

  const radarData = result
    ? GOAL_LABELS.map((g) => ({
        goal: g.icon + " " + g.key,
        value: result.goals[g.key],
        fullMark: 100,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Калькулятор личного вклада</h1>
          </div>
          <p className="text-emerald-100 text-lg mt-2">
            Узнайте, как вы лично влияете на достижение национальных целей развития России
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 w-12 md:w-24 mx-1 transition-colors ${i < step ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Profession */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ваша профессия и регион</h2>
            <p className="text-gray-500 text-sm mb-6">Это помогает оценить отраслевой вклад в национальные цели</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сфера деятельности</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROFESSIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setForm({ ...form, profession: p.value })}
                    className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                      form.profession === p.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Регион</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Выберите регион...</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Уровень образования</label>
              <div className="flex flex-wrap gap-2">
                {EDUCATION_LEVELS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setForm({ ...form, education: e.value })}
                    className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                      form.education === e.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!form.profession || !form.region}
              onClick={() => setStep(1)}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Далее <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Finances */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Финансовый вклад</h2>
            <p className="text-gray-500 text-sm mb-6">Налоги — основной источник финансирования национальных программ</p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Примерный годовой доход (руб.): <span className="text-emerald-600 font-semibold">{form.taxPaid.toLocaleString("ru-RU")}</span>
              </label>
              <input
                type="range"
                min={0}
                max={5000000}
                step={10000}
                value={form.taxPaid}
                onChange={(e) => setForm({ ...form, taxPaid: Number(e.target.value) })}
                className="w-full accent-emerald-500 h-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 ₽</span>
                <span>5 000 000 ₽</span>
              </div>
              <div className="mt-3 bg-emerald-50 rounded-xl p-3 text-sm text-emerald-800">
                Примерный НДФЛ: <strong>{Math.round(form.taxPaid * 0.13).toLocaleString("ru-RU")} ₽/год</strong>
                {" "}(13% от дохода идёт на финансирование госпрограмм)
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-500 transition-colors"
              >
                Далее <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Activity */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Социальная активность</h2>
            <p className="text-gray-500 text-sm mb-6">Волонтёрство, семья и гражданская позиция тоже влияют на страну</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Часов волонтёрства в год: <span className="text-emerald-600 font-semibold">{form.volunteerHours}</span>
              </label>
              <input
                type="range"
                min={0}
                max={500}
                step={5}
                value={form.volunteerHours}
                onChange={(e) => setForm({ ...form, volunteerHours: Number(e.target.value) })}
                className="w-full accent-emerald-500 h-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 часов</span>
                <span>500 часов</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Количество детей: <span className="text-emerald-600 font-semibold">{form.children}</span>
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, "5+"].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm({ ...form, children: n === "5+" ? 5 : Number(n) })}
                    className={`w-12 h-12 rounded-xl border text-sm font-semibold transition-colors ${
                      form.children === (n === "5+" ? 5 : Number(n))
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Дети — прямой вклад в демографическую цель</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>
              <button
                onClick={handleCalc}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-500 transition-colors"
              >
                <Calculator className="w-4 h-4" /> Рассчитать вклад
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
              <div className="text-6xl mb-3">
                {result.totalScore >= 75 ? "🌟" : result.totalScore >= 50 ? "📈" : result.totalScore >= 25 ? "💡" : "🌱"}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Ваш индекс вклада</h2>
              <div className="text-6xl font-black text-emerald-600 mb-2">{result.totalScore}</div>
              <div className="text-lg mb-4"><ScoreLevel score={result.totalScore} /></div>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Этот индекс отражает совокупный вклад вашей профессии, налогов, волонтёрства и семьи в достижение 7 национальных целей России
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Влияние по каждой цели</h3>
              <div className="h-72 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="goal" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Вклад" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Tooltip formatter={(v) => [`${v}/100`, "Вклад"]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {GOAL_LABELS.map((g) => {
                  const val = result.goals[g.key];
                  return (
                    <div key={g.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{g.icon} {g.key}</span>
                        <span className="text-sm font-bold text-emerald-600">{val}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-2 rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-3">Как увеличить свой вклад?</h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                {form.volunteerHours < 50 && <li>• Займитесь волонтёрством — уже 50 часов в год значительно повышают вклад</li>}
                {form.children < 2 && <li>• Поддержите демографическую цель — семья с детьми напрямую влияет на будущее</li>}
                {EDUCATION_LEVELS.findIndex(e => e.value === form.education) < 3 && <li>• Повышение образования увеличивает профессиональный вклад в экономику</li>}
                <li>• Участвуйте в региональных программах и гражданских инициативах</li>
                <li>• Поделитесь результатами и вдохновите других на участие</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep(0); setResult(null); }}
                className="flex-1 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Пересчитать
              </button>
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500"
                onClick={() => { if (navigator.share) { navigator.share({ title: "Мой вклад в Россию 2030", text: `Мой индекс вклада: ${result.totalScore}/100` }); }}}
              >
                <Share2 className="w-4 h-4" />
                Поделиться
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
