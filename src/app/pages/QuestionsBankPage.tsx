import { useState } from "react";
import { useAiQuestionsQuery } from "../hooks/useAiQuestions";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";

export function QuestionsBankPage() {
  const query = useAiQuestionsQuery(true);
  const questions = query.data || [];
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const paginated = questions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && page > 1) {
      setPage((p) => p - 1);
    }
    if (direction === "next" && page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Banco de Perguntas (IA)
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Perguntas geradas automaticamente
            </h1>
            <p className="text-sm text-slate-600">
              Lista consolidada das perguntas objetivas geradas pela IA. As
              respostas corretas não são exibidas.
            </p>
          </div>
        </div>
      </header>

      {query.isLoading ? (
        <div className="space-y-3">
          <div className="h-16 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          <div className="h-16 bg-white border border-slate-200 rounded-2xl animate-pulse" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600">
            Nenhuma pergunta gerada pela IA ainda. Gere perguntas nos tópicos
            para vê-las aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total: {questions.length} perguntas</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-xs font-semibold">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {paginated.map((q) => (
              <article
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      {q.topicTitle}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      {q.question}
                    </h3>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>{format(new Date(q.createdAt), "dd/MM/yyyy HH:mm")}</p>
                    <p className="font-semibold text-emerald-600">
                      {q.status === "ACTIVE" ? "Ativa" : "Inativa"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 text-sm text-slate-600">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={page === 1}
                className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-xs font-semibold">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
