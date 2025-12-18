import { useMemo } from 'react';
import { FolderGit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Topic } from '../../domain/topic';
import { Badge } from '../../components/ui/Badge';
import { TopicCard } from '../../features/topics/components/TopicCard';
import { groupKey, groupSlug } from '../utils/groupSlug';

export function TopicsGroupsPage({
  topics,
  needsReview,
  onOpenTopic,
}: {
  topics: Topic[];
  needsReview: Topic[];
  onOpenTopic: (topic: Topic) => void;
}) {
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

    return Array.from(map.values())
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((group) => ({
        ...group,
        topics: group.topics.slice().sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()),
      }));
  }, [topics]);

  const visibleGroups = groups.slice(0, 6);
  const overflowGroups = groups.slice(6);

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FolderGit2 className="text-indigo-500" size={20} />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tópicos agrupados</h2>
            <p className="text-sm text-slate-500">Veja os conteúdos por assunto.</p>
          </div>
        </div>
        <Badge variant="info">{topics.length} tópicos</Badge>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">Ainda não há tópicos cadastrados.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {visibleGroups.map((group) => (
              <div key={group.slug} className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-800">{group.label}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{group.topics.length} itens</Badge>
                    <Link
                      to={`/temas/${group.slug}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Ver grupo
                    </Link>
                  </div>
                </div>
                <div className="grid gap-3">
                  {group.topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      variant={needsReviewIds.has(topic.id) ? 'due' : 'upcoming'}
                      onClick={() => onOpenTopic(topic)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {overflowGroups.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-700 mb-3">Outros grupos</p>
              <div className="flex flex-wrap gap-2">
                {overflowGroups.map((group) => (
                  <Link
                    key={group.slug}
                    to={`/temas/${group.slug}`}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                  >
                    {group.label} ({group.topics.length})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
