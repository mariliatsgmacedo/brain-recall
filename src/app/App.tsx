import { useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useStudyStore } from '../store/useStudyStore';
import { useSortedTopics } from '../features/topics/hooks/useSortedTopics';
import type { Topic } from '../domain/topic';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CyclesPage } from './pages/CyclesPage';
import { AddTopicPage } from './pages/AddTopicPage';
import { EditTopicPage } from './pages/EditTopicPage';
import { TopicDetailsPage } from './pages/TopicDetailsPage';
import { TopicsGroupsPage } from './pages/TopicsGroupsPage';
import { GroupTopicsPage } from './pages/GroupTopicsPage';
import { DASHBOARD_MAX_CYCLE_INDEX } from './config';
import { buildTopicSlug } from './utils/topicSlug';

export default function App() {
  const { topics, addTopic, updateTopic, completeReview, deleteTopic } = useStudyStore();
  const sortedTopics = useSortedTopics(topics);
  const navigate = useNavigate();

  const dashboardUpcoming = useMemo(
    () => sortedTopics.upcoming.filter((topic) => topic.currentCycle <= DASHBOARD_MAX_CYCLE_INDEX),
    [sortedTopics.upcoming],
  );

  const allTopicsSorted = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (a.currentCycle !== b.currentCycle) {
        return a.currentCycle - b.currentCycle;
      }
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    });
  }, [topics]);

  const handleOpenTopic = (topic: Topic) => {
    navigate(`/topico/${buildTopicSlug(topic)}`);
  };

  return (
    <AppLayout topicsCount={topics.length}>
      <Routes>
        <Route
          path="/"
          element={<DashboardPage topics={topics} upcoming={dashboardUpcoming} onOpenTopic={handleOpenTopic} />}
        />
        <Route
          path="/ciclos"
          element={
            <CyclesPage topics={allTopicsSorted} needsReview={sortedTopics.needsReview} onOpenTopic={handleOpenTopic} />
          }
        />
        <Route path="/novo" element={<AddTopicPage onAdd={addTopic} />} />
        <Route
          path="/topico/:slug"
          element={<TopicDetailsPage topics={topics} onCompleteReview={completeReview} onDelete={deleteTopic} />}
        />
        <Route path="/topico/:slug/editar" element={<EditTopicPage topics={topics} onUpdate={updateTopic} />} />
        <Route
          path="/temas"
          element={<TopicsGroupsPage topics={topics} needsReview={sortedTopics.needsReview} onOpenTopic={handleOpenTopic} />}
        />
        <Route
          path="/temas/:slug"
          element={<GroupTopicsPage topics={topics} needsReview={sortedTopics.needsReview} onOpenTopic={handleOpenTopic} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
