import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "Нейронная адаптация в реальном времени",
    description: "ИИ-алгоритм самообучается под уникальные паттерны вашего мозга за 72 часа — и продолжает совершенствоваться каждый день.",
    icon: "brain",
    badge: "ИИ",
  },
  {
    title: "Клинически сертифицированная защита",
    description: "Шифрование нейроданных по стандартам FDA и CE. Ваш мозговой сигнал никогда не покидает зашифрованный контур.",
    icon: "lock",
    badge: "FDA",
  },
  {
    title: "Мысль → действие за 0.9 мс",
    description: "Трансляция намерения в команду быстрее рефлекторного движения руки. Точность сигнала — 99.7%.",
    icon: "globe",
    badge: "Точность",
  },
  {
    title: "Предиктивная калибровка намерений",
    description: "ML-модель предугадывает следующее действие до его полного формирования, устраняя задержку между мыслью и результатом.",
    icon: "zap",
    badge: "Предикт",
  },
  {
    title: "Биометрическая интеграция",
    description: "Синхронизация с пульсом, давлением и ритмом сна для адаптации нейроинтерфейса к состоянию вашего тела прямо сейчас.",
    icon: "link",
    badge: "Здоровье",
  },
  {
    title: "AR/VR без контроллеров",
    description: "Нативное управление расширенной реальностью силой мысли — для медицины, обучения и профессиональных задач.",
    icon: "target",
    badge: "XR Ready",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Технология, которая вас слышит</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SynapseAI — первый нейроинтерфейс, адаптирующийся под вас, а не наоборот
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">
                    {feature.icon === "brain" && "&#129504;"}
                    {feature.icon === "lock" && "&#128274;"}
                    {feature.icon === "globe" && "&#127760;"}
                    {feature.icon === "zap" && "&#9889;"}
                    {feature.icon === "link" && "&#128279;"}
                    {feature.icon === "target" && "&#127919;"}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
