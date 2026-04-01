import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Насколько безопасна имплантация SynapseAI?",
      answer:
        "Процедура выполняется прецизионным хирургическим роботом через минимально инвазивный разрез. Все материалы биосовместимы и сертифицированы FDA/CE. За 3 года клинических испытаний не зафиксировано ни одного серьёзного нежелательного события.",
    },
    {
      question: "Сколько длится операция и восстановление?",
      answer:
        "Операция занимает 2–3 часа под местной анестезией с лёгкой седацией. Пациент покидает клинику в тот же день. Полная активация нейроинтерфейса происходит через 2–4 недели — пока мозг формирует стабильные нейронные пути.",
    },
    {
      question: "Можно ли удалить имплант?",
      answer:
        "Да. SynapseAI спроектирован полностью обратимым — устройство можно безопасно извлечь в любой момент. Удаление занимает менее часа и не оставляет необратимых изменений в нейронной ткани.",
    },
    {
      question: "Как ощущается управление устройствами мыслью?",
      answer:
        "Большинство пользователей описывают это как «мышечную память, но для цифрового мира». Уже через неделю адаптации управление ощущается столь же естественным, как набор текста на клавиатуре — только быстрее и без физических усилий.",
    },
    {
      question: "Как часто нужно заряжать устройство?",
      answer:
        "SynapseAI работает полный день на одном заряде. Беспроводная зарядка занимает 40 минут с помощью компактного внешнего устройства, которое размещается рядом во время сна.",
    },
    {
      question: "Кто может стать участником бета-теста?",
      answer:
        "На первом этапе мы принимаем пациентов с выраженным параличом верхних и нижних конечностей, а также здоровых добровольцев для программы когнитивного усиления. Соответствие определяется после детального медицинского скрининга.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Частые вопросы</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Всё, что важно знать о технологии, безопасности и участии в программе SynapseAI.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-red-500/20 mb-4">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-red-400 font-orbitron px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed px-6 pb-4 font-space-mono">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
