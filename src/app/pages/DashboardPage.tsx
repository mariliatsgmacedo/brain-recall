import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Topic } from "../../domain/topic";
import { TopicCard } from "../../features/topics/components/TopicCard";
import { DASHBOARD_PAGE_SIZE } from "../config";
import { getTotalPages, paginate } from "../utils/pagination";

export function DashboardPage({
  topics,
  current,
  upcoming,
  onOpenTopic,
}: {
  topics: Topic[];
  current: Topic[];
  upcoming: Topic[];
  onOpenTopic: (topic: Topic) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const currentTotalPages = getTotalPages(current.length, DASHBOARD_PAGE_SIZE);
  const upcomingTotalPages = getTotalPages(
    upcoming.length,
    DASHBOARD_PAGE_SIZE
  );
  const currentPageNumber = Math.min(currentPage, currentTotalPages);
  const upcomingPageNumber = Math.min(upcomingPage, upcomingTotalPages);
  const currentPageItems = useMemo(
    () => paginate(current, currentPageNumber, DASHBOARD_PAGE_SIZE),
    [currentPageNumber, current]
  );
  const upcomingPageItems = useMemo(
    () => paginate(upcoming, upcomingPageNumber, DASHBOARD_PAGE_SIZE),
    [upcomingPageNumber, upcoming]
  );

  return (
    <>
      <section className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-amber-500" size={20} />
          <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">
            Ciclo Atual
          </h2>
        </div>
      </section>

      {topics.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <BookOpen className="text-slate-300 mx-auto mb-4" size={48} />
          <p className="text-slate-500">
            Comece adicionando seu primeiro estudo!
          </p>
          <Link
            to="/novo"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Criar tópico
          </Link>
        </div>
      ) : (
        <>
          {current.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">Nenhum tópico no ciclo atual.</p>
              <Link
                to="/ciclos"
                className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Ver todos os ciclos
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {currentPageItems.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    variant="due"
                    onClick={() => onOpenTopic(topic)}
                  />
                ))}
              </div>
              {currentTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                  <button
                    onClick={() =>
                      setCurrentPage((current) => Math.max(1, current - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {currentTotalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((current) =>
                        Math.min(currentTotalPages, current + 1)
                      )
                    }
                    disabled={currentPage === currentTotalPages}
                    className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}

          <section className="mt-10 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="text-slate-400" size={20} />
              <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">
                Próximos Ciclos
              </h2>
            </div>
          </section>

          {upcoming.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">
                Sem próximos ciclos nos ciclos menores.
              </p>
              <Link
                to="/ciclos"
                className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Ver todos os ciclos
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {upcomingPageItems.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    variant="upcoming"
                    onClick={() => onOpenTopic(topic)}
                  />
                ))}
              </div>
              {upcomingTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                  <button
                    onClick={() =>
                      setUpcomingPage((current) => Math.max(1, current - 1))
                    }
                    disabled={upcomingPage === 1}
                    className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {upcomingPage} de {upcomingTotalPages}
                  </span>
                  <button
                    onClick={() =>
                      setUpcomingPage((current) =>
                        Math.min(upcomingTotalPages, current + 1)
                      )
                    }
                    disabled={upcomingPage === upcomingTotalPages}
                    className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
