import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: "01",
    title: "Считывание сигнала",
    description:
      "256-канальный нейросенсор захватывает электрические паттерны коры головного мозга с разрешением 0.1 мкВ. Алгоритм фильтрует артефакты мышц и окружающего шума в реальном времени.",
  },
  {
    number: "02",
    title: "Декодирование намерения",
    description:
      "Трансформерная нейросеть, обученная на 40 млн нейросессий, преобразует паттерн активации в семантический вектор намерения с точностью 99.7%.",
  },
  {
    number: "03",
    title: "Исполнение команды",
    description:
      "Декодированное намерение транслируется в API-команду устройства за 0.9 мс через зашифрованный канал — быстрее, чем рефлекс руки.",
  },
]

const stats = [
  { value: "256", unit: "каналов", label: "Нейросенсоров" },
  { value: "0.9", unit: "мс", label: "Задержка сигнала" },
  { value: "99.7", unit: "%", label: "Точность декодинга" },
  { value: "40М", unit: "сессий", label: "Обучающая выборка" },
]

export function TechnologySection() {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/30 mb-4 text-sm px-4 py-1">
            Как это работает
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 font-display">
            О технологии
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SynapseAI объединяет нейросенсорику, машинное обучение и субмиллисекундную передачу
            данных в единый стек — от нейрона до команды.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/40 to-transparent z-10" />
              )}

              <div className="glow-border rounded-xl p-8 h-full flex flex-col gap-4 bg-card hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                {/* Step number */}
                <span className="text-5xl font-bold font-display text-primary/20 leading-none select-none">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-card-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl border border-border bg-card/50 slide-up"
              style={{ animationDelay: `${0.45 + index * 0.1}s` }}
            >
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-4xl font-bold font-display text-primary">{stat.value}</span>
                <span className="text-lg text-muted-foreground pb-1">{stat.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
