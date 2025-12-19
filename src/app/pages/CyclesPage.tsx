import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Topic } from '../../domain/topic';
import { Badge } from '../../components/ui/Badge';
import { TopicCard } from '../../features/topics/components/TopicCard';
import { ALL_CYCLES_PAGE_SIZE } from '../config';
import { getTotalPages, paginate } from '../utils/pagination';

function groupByCycle(items: Topic[]) {
  const groups: { cycleIndex: number; topics: Topic[] }[] = [];
  const groupMap = new Map<number, Topic[]>();

  items.forEach((topic) => {
    if (!groupMap.has(topic.currentCycle)) {
      groupMap.set(topic.currentCycle, []);
      groups.push({ cycleIndex: topic.currentCycle, topics: groupMap.get(topic.currentCycle)! });
    }
    groupMap.get(topic.currentCycle)!.push(topic);
  });

  return groups;
}

export function CyclesPage({
  topics,
  onOpenTopic,
  needsReview,
}: {
  topics: Topic[];
  onOpenTopic: (topic: Topic) => void;
  needsReview: Topic[];
}) {
  const [page, setPage] = useState(1);
  const totalPages = getTotalPages(topics.length, ALL_CYCLES_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => paginate(topics, currentPage, ALL_CYCLES_PAGE_SIZE), [currentPage, topics]);
  const groups = useMemo(() => groupByCycle(pageItems), [pageItems]);
  const needsReviewIds = useMemo(() => new Set(needsReview.map((topic) => topic.id)), [needsReview]);

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Todos os ciclos</h2>
          <p className="text-sm text-slate-500">Veja todos os tópicos organizados por ciclo.</p>
        </div>
        <Badge variant="info">{topics.length} tópicos</Badge>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">Ainda não há tópicos cadastrados.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {groups.map((group, groupIndex) => (
              <details
                key={group.cycleIndex}
                className="group bg-white border border-slate-200 rounded-2xl"
                open={groupIndex === 0}
              >
                <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">Ciclo R{group.cycleIndex + 1}</span>
                    <Badge variant="info">{group.topics.length} tópicos</Badge>
                  </div>
                  <ChevronDown className="text-slate-400 transition-transform group-open:rotate-180" size={18} />
                </summary>
                <div className="px-4 pb-4 grid gap-3">
                  {group.topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      variant={needsReviewIds.has(topic.id) ? 'due' : 'upcoming'}
                      onClick={() => onOpenTopic(topic)}
                    />
                  ))}
                </div>
              </details>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
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
    </section>
  );
}
