import { Timeline } from "@/components/ui/timeline"

export function ApplicationsTimeline() {
  const data = [
    {
      title: "Медицинское восстановление",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            SynapseAI возвращает подвижность людям с параличом, травмами спинного мозга и нейродегенеративными
            заболеваниями. Импульс мысли — снова становится движением.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Восстановление моторики при параплегии и тетраплегии
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Замедление прогрессии БАС и болезни Паркинсона
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Ускорение нейрореабилитации после инсульта в 3× быстрее
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Когнитивное усиление",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Прямые нейрокоммуникации между мозгом и цифровым слоем дают возможность обрабатывать информацию
            быстрее, запоминать точнее и обучаться эффективнее.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Улучшение долговременной памяти и скорости запоминания
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Ускоренное освоение новых навыков и языков
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Нейронный перевод речи в реальном времени
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Цифровая интеграция",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Управляйте устройствами, получайте доступ к данным и общайтесь — без экрана, без клавиатуры,
            без физического контакта. Только мысль.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Управление смартфоном, ПК и умным домом силой мысли
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Прямой доступ к облачным данным и ИИ-ассистентам
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Безмолвная коммуникация в командах и рабочих группах
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="applications" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Где работает SynapseAI</h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            От медицины до повседневной жизни — нейроинтерфейс открывает возможности, которые раньше
            существовали только в научной фантастике.
          </p>
        </div>

        <div className="relative">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  )
}
