import { useMemo, useState, useEffect } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, ChevronDown, Clock } from 'lucide-react';
import { useStudyStore } from '../store/useStudyStore';
import { Badge } from '../components/ui/Badge';
import { AddTopicForm } from '../features/topics/components/AddTopicForm';
import { TopicCard } from '../features/topics/components/TopicCard';
import { TopicDetailsModal } from '../features/topics/components/TopicDetailsModal';
import { useSortedTopics } from '../features/topics/hooks/useSortedTopics';
import type { Topic } from '../domain/topic';
import { REVIEW_INTERVALS_DAYS } from '../domain/review';

const DASHBOARD_PAGE_SIZE = 10;
const ALL_CYCLES_PAGE_SIZE = 15;
const DASHBOARD_MAX_CYCLE_INDEX = 1;

type ViewMode = 'dashboard' | 'cycles';

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function getTotalPages(count: number, pageSize: number) {
  return Math.max(1, Math.ceil(count / pageSize));
}

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

export default function App() {
  const { topics, addTopic, completeReview, deleteTopic } = useStudyStore();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [dashboardPage, setDashboardPage] = useState(1);
  const [allCyclesPage, setAllCyclesPage] = useState(1);
  const sortedTopics = useSortedTopics(topics);

  const dashboardUpcoming = useMemo(
    () => sortedTopics.upcoming.filter((topic) => topic.currentCycle <= DASHBOARD_MAX_CYCLE_INDEX),
    [sortedTopics.upcoming],
  );
  const dashboardTotalPages = getTotalPages(dashboardUpcoming.length, DASHBOARD_PAGE_SIZE);
  const dashboardUpcomingPageItems = paginate(dashboardUpcoming, dashboardPage, DASHBOARD_PAGE_SIZE);

  const allTopicsSorted = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (a.currentCycle !== b.currentCycle) {
        return a.currentCycle - b.currentCycle;
      }
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    });
  }, [topics]);
  const allCyclesTotalPages = getTotalPages(allTopicsSorted.length, ALL_CYCLES_PAGE_SIZE);
  const allCyclesPageItems = paginate(allTopicsSorted, allCyclesPage, ALL_CYCLES_PAGE_SIZE);
  const allCyclesGroups = useMemo(() => groupByCycle(allCyclesPageItems), [allCyclesPageItems]);
  const needsReviewIds = useMemo(
    () => new Set(sortedTopics.needsReview.map((topic) => topic.id)),
    [sortedTopics.needsReview],
  );

  useEffect(() => {
    if (dashboardPage > dashboardTotalPages) {
      setDashboardPage(dashboardTotalPages);
    }
  }, [dashboardPage, dashboardTotalPages]);

  useEffect(() => {
    if (allCyclesPage > allCyclesTotalPages) {
      setAllCyclesPage(allCyclesTotalPages);
    }
  }, [allCyclesPage, allCyclesTotalPages]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BrainRecall</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'dashboard' ? 'cycles' : 'dashboard')}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {viewMode === 'dashboard' ? 'Ver todos os ciclos' : 'Voltar ao dashboard'}
            </button>
            <Badge variant="info">{topics.length} tópicos ativos</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {viewMode === 'dashboard' ? (
          <>
            <AddTopicForm onAdd={addTopic} />

            {sortedTopics.needsReview.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="text-amber-500" size={20} />
                  <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Revisões Pendentes</h2>
                </div>
                <div className="grid gap-4">
                  {sortedTopics.needsReview.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} variant="due" onClick={() => setSelectedTopic(topic)} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-slate-400" size={20} />
                <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Próximos Ciclos</h2>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <BookOpen className="text-slate-300 mx-auto mb-4" size={48} />
                  <p className="text-slate-500">Comece adicionando seu primeiro estudo acima!</p>
                </div>
              ) : dashboardUpcoming.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500">Sem próximos ciclos nos ciclos menores.</p>
                  <button
                    onClick={() => setViewMode('cycles')}
                    className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Ver todos os ciclos
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-3">
                    {dashboardUpcomingPageItems.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} variant="upcoming" onClick={() => setSelectedTopic(topic)} />
                    ))}
                  </div>
                  {dashboardTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                      <button
                        onClick={() => setDashboardPage((page) => Math.max(1, page - 1))}
                        disabled={dashboardPage === 1}
                        className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <span>
                        Página {dashboardPage} de {dashboardTotalPages}
                      </span>
                      <button
                        onClick={() => setDashboardPage((page) => Math.min(dashboardTotalPages, page + 1))}
                        disabled={dashboardPage === dashboardTotalPages}
                        className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        ) : (
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
                <BookOpen className="text-slate-300 mx-auto mb-4" size={48} />
                <p className="text-slate-500">Ainda não há tópicos cadastrados.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {allCyclesGroups.map((group, groupIndex) => (
                    <details
                      key={group.cycleIndex}
                      className="group bg-white border border-slate-200 rounded-2xl"
                      defaultOpen={groupIndex === 0}
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
                            onClick={() => setSelectedTopic(topic)}
                          />
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
                {allCyclesTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
                    <button
                      onClick={() => setAllCyclesPage((page) => Math.max(1, page - 1))}
                      disabled={allCyclesPage === 1}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span>
                      Página {allCyclesPage} de {allCyclesTotalPages}
                    </span>
                    <button
                      onClick={() => setAllCyclesPage((page) => Math.min(allCyclesTotalPages, page + 1))}
                      disabled={allCyclesPage === allCyclesTotalPages}
                      className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      <TopicDetailsModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onCompleteReview={completeReview}
        onDelete={deleteTopic}
      />

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-400 text-xs border-t border-slate-200 mt-12">
        Baseado na curva de retenção de Ebbinghaus • R1({REVIEW_INTERVALS_DAYS[0]}d), R7({REVIEW_INTERVALS_DAYS[1]}d),
        R15({REVIEW_INTERVALS_DAYS[2]}d), R30({REVIEW_INTERVALS_DAYS[3]}d).
      </footer>
    </div>
  );
}
