import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Елена Родригес",
    role: "Директор по нейронаукам, Quantum Dynamics",
    avatar: "/professional-woman-scientist.png",
    content:
      "SynapseAI перевернул нашу работу с нейрореабилитацией. За 6 месяцев применения функциональные показатели пациентов улучшились в среднем на 340%.",
  },
  {
    name: "Маркус Уильямс",
    role: "Руководитель R&D, Stellar Analytics",
    avatar: "/cybersecurity-expert-man.jpg",
    content:
      "Точность нейросигнала и уровень защиты данных — вне конкуренции. Мы сократили цикл клинических испытаний вдвое благодаря платформе SynapseAI.",
  },
  {
    name: "Анна Ковальски",
    role: "Вице-президент по продукту, Nova Industries",
    avatar: "/asian-woman-tech-developer.jpg",
    content:
      "Интеграция заняла меньше недели. Адаптивные алгоритмы буквально научились предугадывать намерения оператора — ничего подобного мы раньше не тестировали.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-card-foreground mb-4 font-sans">Нам доверяют лидеры науки и бизнеса</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Исследователи, клиники и технологические компании уже работают с SynapseAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glow-border slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
