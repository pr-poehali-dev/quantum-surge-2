/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, ThumbsUp, Eye, Pin, Plus, X, ArrowLeft, Send, Clock } from "lucide-react";
import { api } from "@/lib/api";

const FORUM_CATEGORIES = ["Все", "Цифровизация", "Экономика", "Здравоохранение", "Экология", "Образование", "Инфраструктура", "Общее"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500", "bg-rose-500", "bg-teal-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function TopicDetail({ topicId, onBack }: { topicId: number; onBack: () => void }) {
  const qc = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");

  const { data: topic, isLoading } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: () => api.getForumTopic(topicId),
  });

  const replyMutation = useMutation({
    mutationFn: (data: object) => api.replyToTopic(topicId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["topic", topicId] });
      setReplyText("");
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => api.likeForumTopic(topicId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["topic", topicId] }),
  });

  if (isLoading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к списку
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {topic?.pinned && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              <Pin className="w-3 h-3" /> Закреплено
            </span>
          )}
          {topic?.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{topic.category}</span>
          )}
          {topic?.goal_title && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{topic.goal_title}</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{topic?.title}</h2>
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={topic?.author_name || "?"} />
          <div>
            <div className="text-sm font-semibold text-gray-800">{topic?.author_name}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {topic?.created_at && formatDate(topic.created_at)}
            </div>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{topic?.content}</p>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => likeMutation.mutate()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{topic?.likes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{topic?.views}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span>{topic?.replies?.length} ответов</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      {topic?.replies?.length > 0 && (
        <div className="space-y-3 mb-6">
          {topic.replies.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={r.author_name} />
                <div>
                  <span className="text-sm font-semibold text-gray-800">{r.author_name}</span>
                  <span className="text-xs text-gray-400 ml-2">{formatDate(r.created_at)}</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {r.likes}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Написать ответ</h3>
        <input
          type="text"
          placeholder="Ваше имя"
          value={replyName}
          onChange={(e) => setReplyName(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <textarea
          placeholder="Ваш ответ..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          disabled={!replyText.trim() || !replyName.trim() || replyMutation.isPending}
          onClick={() =>
            replyMutation.mutate({ author_name: replyName, content: replyText })
          }
          className="flex items-center gap-2 bg-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {replyMutation.isPending ? "Отправка..." : "Ответить"}
        </button>
      </div>
    </div>
  );
}

function NewTopicModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", content: "", author_name: "", category: "Общее", goal_id: "" });
  const { data: goals } = useQuery({ queryKey: ["goals"], queryFn: api.getGoals });

  const mutation = useMutation({
    mutationFn: api.createForumTopic,
    onSuccess: () => { onCreated(); onClose(); },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Создать новую тему</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
            <input
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Иван Иванов"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок темы</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Тема обсуждения..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Содержание</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Опишите вашу идею, вопрос или опыт..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {FORUM_CATEGORIES.filter((c) => c !== "Все").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Нацпроект (опц.)</label>
              <select
                value={form.goal_id}
                onChange={(e) => setForm({ ...form, goal_id: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Не выбрано</option>
                {goals?.map((g: any) => <option key={g.id} value={g.id}>{g.icon} {g.title}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-200">
          <button onClick={onClose} className="flex-1 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Отмена
          </button>
          <button
            disabled={!form.title.trim() || !form.content.trim() || !form.author_name.trim() || mutation.isPending}
            onClick={() =>
              mutation.mutate({
                title: form.title,
                content: form.content,
                author_name: form.author_name,
                category: form.category,
                goal_id: form.goal_id || undefined,
              })
            }
            className="flex-1 bg-purple-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? "Создание..." : "Создать тему"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Forum() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();

  const params: Record<string, string> = {};
  if (activeCategory !== "Все") params.category = activeCategory;
  if (search) params.search = search;

  const { data: topics, isLoading } = useQuery({
    queryKey: ["forum", params],
    queryFn: () => api.getForumTopics(params),
  });

  if (selectedTopicId !== null) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-2xl font-bold">Форум стратегий развития</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <TopicDetail topicId={selectedTopicId} onBack={() => setSelectedTopicId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {showModal && (
        <NewTopicModal
          onClose={() => setShowModal(false)}
          onCreated={() => qc.invalidateQueries({ queryKey: ["forum"] })}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-8 h-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Форум стратегий</h1>
              </div>
              <p className="text-purple-100 text-lg">Обсуждение лучших практик и стратегий регионального развития</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-white text-purple-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Новая тема
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="relative mb-3">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по темам..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FORUM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : topics?.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Темы не найдены</p>
            <button onClick={() => setShowModal(true)} className="mt-4 text-purple-600 font-medium hover:text-purple-800">
              Создать первую тему →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {topics?.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {t.pinned && (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                          <Pin className="w-2.5 h-2.5" /> Закреплено
                        </span>
                      )}
                      {t.category && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.category}</span>
                      )}
                      {t.goal_title && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{t.goal_title}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{t.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="font-medium text-gray-600">{t.author_name}</span>
                      <span>·</span>
                      <span>{formatDate(t.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {t.reply_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {t.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {t.views}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
