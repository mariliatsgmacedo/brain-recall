import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Topic } from '../../domain/topic';
import { Badge } from '../../components/ui/Badge';
import { TopicCard } from '../../features/topics/components/TopicCard';
import { groupKey, groupSlug } from '../utils/groupSlug';
import { GROUP_PAGE_SIZE } from '../config';
import { getTotalPages, paginate } from '../utils/pagination';

export function GroupTopicsPage({
  topics,
  needsReview,
  onOpenTopic,
}: {
  topics: Topic[];
  needsReview: Topic[];
  onOpenTopic: (topic: Topic) => void;
}) {
  const { slug } = useParams();
  const needsReviewIds = useMemo(() => new Set(needsReview.map((t) => t.id)), [needsReview]);

  const groups = useMemo(() => {
    const map = new Map<
      string,
      {
        label: string;
        slug: string;
        topics: Topic[];
      }
    >();

    topics.forEach((topic) => {
      const rawTitle = topic.title || 'Sem título';
      const baseTitle = rawTitle.replace(/\s*\(.*?\)\s*$/, '').trim() || 'Sem título';
      const key = groupKey(rawTitle);
      if (!map.has(key)) {
        map.set(key, { label: baseTitle, slug: groupSlug(rawTitle), topics: [] });
      }
      map.get(key)!.topics.push(topic);
    });

    return Array.from(map.values());
  }, [topics]);

  const group = groups.find((g) => g.slug === slug);

  const sortedTopics = useMemo(() => {
    if (!group) return [];
    return group.topics.slice().sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
  }, [group]);

  const [page, setPage] = useState(1);
  const totalPages = getTotalPages(sortedTopics.length, GROUP_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => paginate(sortedTopics, currentPage, GROUP_PAGE_SIZE),
    [sortedTopics, currentPage],
  );

  if (!group) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-700">Grupo não encontrado</h2>
        <p className="text-sm text-slate-500 mt-2">O grupo selecionado não existe ou não possui tópicos.</p>
        <Link to="/temas" className="inline-block mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Voltar para grupos
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grupo</p>
          <h2 className="text-2xl font-bold text-slate-800">{group.label}</h2>
          <p className="text-sm text-slate-500">Conteúdos relacionados a este tema.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">{group.topics.length} itens</Badge>
          <Link to="/temas" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Ver todos os grupos
          </Link>
        </div>
      </div>

      <div className="grid gap-3">
        {pageItems.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            variant={needsReviewIds.has(topic.id) ? 'due' : 'upcoming'}
            onClick={() => onOpenTopic(topic)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}
