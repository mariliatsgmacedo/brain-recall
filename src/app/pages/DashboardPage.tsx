import { useMemo, useState } from 'react';
import { BookOpen, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Topic } from '../../domain/topic';
import { TopicCard } from '../../features/topics/components/TopicCard';
import { DASHBOARD_PAGE_SIZE } from '../config';
import { getTotalPages, paginate } from '../utils/pagination';

export function DashboardPage({
  topics,
  upcoming,
  onOpenTopic,
}: {
  topics: Topic[];
  upcoming: Topic[];
  onOpenTopic: (topic: Topic) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = getTotalPages(upcoming.length, DASHBOARD_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => paginate(upcoming, currentPage, DASHBOARD_PAGE_SIZE), [currentPage, upcoming]);

  return (
    <>
      <section className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="text-slate-400" size={20} />
          <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Próximos Ciclos</h2>
        </div>
        <Link
          to="/novo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Adicionar tópico
        </Link>
      </section>

      {topics.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <BookOpen className="text-slate-300 mx-auto mb-4" size={48} />
          <p className="text-slate-500">Comece adicionando seu primeiro estudo!</p>
          <Link
            to="/novo"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Criar tópico
          </Link>
        </div>
      ) : upcoming.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">Sem próximos ciclos nos ciclos menores.</p>
          <Link to="/ciclos" className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Ver todos os ciclos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {pageItems.map((topic) => (
              <TopicCard key={topic.id} topic={topic} variant="upcoming" onClick={() => onOpenTopic(topic)} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
