import { useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import type { Topic } from "../../domain/topic";
import { Modal } from "../../components/ui/Modal";
import { buildTopicSlug, extractIdFromSlug } from "../utils/topicSlug";
import { PomodoroTimer } from "../../features/pomodoro/PomodoroTimer";

export function TopicDetailsPage({
  topics,
  onCompleteReview,
  onDelete,
}: {
  topics: Topic[];
  onCompleteReview: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const topicId = slug ? extractIdFromSlug(slug) : "";
  const topic = topics.find((item) => item.id === topicId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!topic) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-700">
          Tópico não encontrado
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          O tópico que você tentou abrir não existe ou foi removido.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Voltar ao dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <BookOpen size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Resumo do Estudo
              </span>
            </div>
            <Link
              to={`/topico/${buildTopicSlug(topic)}/editar`}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Editar tópico
            </Link>
          </div>
          <div className="text-slate-700" data-color-mode="light">
            <MDEditor.Markdown
              source={
                topic.description ||
                "Nenhuma descrição fornecida para este tópico."
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Detalhes do Conteúdo
                </p>
                <h2 className="text-xl font-bold text-slate-800 mt-2">
                  {topic.title}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Próxima Revisão
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {new Date(topic.nextReview).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Ciclo Atual
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  R{topic.currentCycle + 1}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  Promise.resolve(onCompleteReview(topic.id))
                    .then(() => navigate("/"))
                    .catch(() => {});
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all"
              >
                Marcar como Revisado
              </button>

              <Link
                to="/"
                className="w-full py-3 rounded-xl text-center font-semibold text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200"
              >
                Voltar
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-3 bg-white hover:bg-red-50 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-transparent hover:border-red-100"
              >
                Excluir Tópico
              </button>
            </div>
          </div>
          <PomodoroTimer />
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir tópico"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Tem certeza que deseja excluir "{topic.title}"? Essa ação não pode
            ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
              <button
                onClick={() => {
                  Promise.resolve(onDelete(topic.id))
                    .then(() => {
                      setShowDeleteModal(false);
                      navigate("/");
                    })
                    .catch(() => {});
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2 transition-colors"
              >
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
