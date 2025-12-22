import { useEffect, useState } from "react";
import { BookOpen, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import type { Topic } from "../../domain/topic";
import { Modal } from "../../components/ui/Modal";
import { buildTopicSlug, extractIdFromSlug } from "../utils/topicSlug";
import { PomodoroTimer } from "../../features/pomodoro/PomodoroTimer";
import {
  useAnswerQuestionMutation,
  useGenerateQuestionMutation,
  useNextReviewQuestion,
} from "../hooks/useReviewFlow";
import type { AnswerResult, OptionKey } from "../../domain/question";

interface TopicDetailsProps {
  topics: Topic[];
  onCompleteReview: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export function TopicDetailsPage(props: TopicDetailsProps) {
  const { slug } = useParams();
  const topicId = slug ? extractIdFromSlug(slug) : "";
  const topic = props.topics.find((item) => item.id === topicId);

  if (!topic) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-700">Tópico não encontrado</h2>
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

  return <TopicDetailsContent topic={topic} {...props} />;
}

function TopicDetailsContent({ topic, onCompleteReview, onDelete }: TopicDetailsProps & { topic: Topic }) {
  const navigate = useNavigate();
  const reviewQuery = useNextReviewQuestion(topic.id, true);
  const answerMutation = useAnswerQuestionMutation(topic.id);
  const generateMutation = useGenerateQuestionMutation(topic.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const reviewState = reviewQuery.data;
  const activeQuestionsCount = reviewState?.activeQuestionsCount ?? 0;
  const currentQuestion = reviewState?.question || null;
  const isBlocked = reviewState ? !reviewState.apiUnavailable && activeQuestionsCount === 0 : false;
  const apiUnavailable = Boolean(reviewState?.apiUnavailable);
  const answeredToday = Boolean(reviewState?.answeredToday);

  useEffect(() => {
    setSelectedOption(null);
    setAnswerResult(null);
    setContentUnlocked(false);
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (answeredToday) {
      setContentUnlocked(true);
    }
  }, [answeredToday]);

  const handleAnswer = (optionKey: OptionKey) => {
    if (!currentQuestion || answerMutation.isPending) return;
    setSelectedOption(optionKey);

    answerMutation
      .mutateAsync({ questionId: currentQuestion.id, selectedOption: optionKey })
      .then((payload) => {
        setAnswerResult(payload.result);
        setContentUnlocked(true);
      })
      .catch(() => {});
  };

  const handleGenerateQuestion = () => {
    setGenerateError(null);
    generateMutation
      .mutateAsync(topic.description ? { summary: topic.description } : {})
      .then(() => reviewQuery.refetch())
      .catch((err) => setGenerateError(err.message || "Falha ao gerar pergunta."));
  };

  const showSummaryOverlay = !contentUnlocked && !apiUnavailable;
  const canCompleteReview = Boolean(answerResult) || apiUnavailable || answeredToday;
  const reviewCompletedToday = answeredToday || Boolean(answerResult);

  const renderQuestionArea = () => {
    if (answeredToday) return null;

    if (reviewQuery.isLoading) {
      return (
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
        </div>
      );
    }

    if (isBlocked) {
      return (
        <div className="p-4 border border-rose-200 bg-rose-50 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-rose-500">⛔</div>
            <div className="space-y-2">
              <p className="font-bold text-rose-700 text-sm">Este tópico não possui perguntas ativas.</p>
              <p className="text-sm text-rose-700">Para continuar revisando, gere automaticamente.</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateQuestion}
                  disabled={generateMutation.isPending}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 disabled:opacity-60"
                >
                  {generateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Gerar perguntas automaticamente
                </button>
              </div>
              {generateError && <p className="text-xs text-rose-600 font-semibold">{generateError}</p>}
            </div>
          </div>
        </div>
      );
    }

    if (!currentQuestion) {
      return <p className="text-sm text-slate-500">Nenhuma pergunta disponível agora. Tente novamente em instantes.</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Pergunta objetiva</p>
          <h3 className="text-lg font-semibold text-slate-800">{currentQuestion.question}</h3>
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.key;
            const isCorrect = answerResult?.correctOption === option.key;
            const showFeedback = Boolean(answerResult);
            const isWrongSelection = showFeedback && answerResult?.selectedOption === option.key && !answerResult?.isCorrect;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => handleAnswer(option.key)}
                disabled={answerMutation.isPending || showFeedback}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isCorrect
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : isWrongSelection
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : isSelected
                    ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                    : "border-slate-200 bg-white text-slate-800 hover:border-indigo-200 hover:bg-indigo-50"
                } ${answerMutation.isPending ? "opacity-70" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{option.key}</span>
                  <span className="text-sm">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {answerMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Registrando resposta...
          </div>
        )}

        {answerResult && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg border ${
              answerResult.isCorrect
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            <span>{answerResult.isCorrect ? "✅" : "❌"}</span>
            <div className="text-sm">
              {answerResult.isCorrect
                ? "Resposta correta! Resumo liberado."
                : `Resposta incorreta. Alternativa correta: ${answerResult.correctOption}. O resumo foi liberado para revisão.`}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {!answeredToday && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-indigo-600">
                  <BookOpen size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Avaliação do Tópico</span>
                </div>
                <div className="text-xs text-slate-500">Perguntas ativas: {activeQuestionsCount}</div>
              </div>
              {renderQuestionArea()}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <BookOpen size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Resumo do Estudo</span>
              </div>
              <Link to={`/topico/${buildTopicSlug(topic)}/editar`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Editar tópico
              </Link>
            </div>
            <div
              className={`text-slate-700 transition-all ${showSummaryOverlay ? "blur-sm select-none pointer-events-none" : ""}`}
              data-color-mode="light"
            >
              <MDEditor.Markdown source={topic.description || "Nenhuma descrição fornecida para este tópico."} />
            </div>

            {showSummaryOverlay && (
              <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="text-2xl">🔒</div>
                <p className="text-sm text-slate-700 font-semibold">Responda uma pergunta objetiva para liberar o resumo.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalhes do Conteúdo</p>
                <h2 className="text-xl font-bold text-slate-800 mt-2">{topic.title}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Próxima Revisão</span>
                <span className="text-sm font-semibold text-slate-700">{new Date(topic.nextReview).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ciclo Atual</span>
                <span className="text-sm font-semibold text-slate-700">R{topic.currentCycle + 1}</span>
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
                disabled={!canCompleteReview || reviewCompletedToday}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all"
              >
                Marcar como Revisado
              </button>

              <Link to="/" className="w-full py-3 rounded-xl text-center font-semibold text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200">
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
          {answeredToday && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800">
              <p className="font-semibold text-sm">Pergunta do dia respondida</p>
              <p className="text-sm">Você já respondeu a pergunta deste tópico hoje. Amanhã gere uma nova pergunta para liberar novamente.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Excluir tópico">
        <div className="space-y-4">
          <p className="text-slate-600">Tem certeza que deseja excluir "{topic.title}"? Essa ação não pode ser desfeita.</p>
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

