import { useMemo } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useSortedTopics } from "../features/topics/hooks/useSortedTopics";
import type { Topic } from "../domain/topic";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { CyclesPage } from "./pages/CyclesPage";
import { AddTopicPage } from "./pages/AddTopicPage";
import { EditTopicPage } from "./pages/EditTopicPage";
import { TopicDetailsPage } from "./pages/TopicDetailsPage";
import { TopicsGroupsPage } from "./pages/TopicsGroupsPage";
import { GroupTopicsPage } from "./pages/GroupTopicsPage";
import { DASHBOARD_MAX_CYCLE_INDEX } from "./config";
import { buildTopicSlug } from "./utils/topicSlug";
import { LandingPage } from "./pages/LandingPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DeleteAccountPage } from "./pages/DeleteAccountPage";
import { useAuthStore } from "../store/useAuthStore";

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { topics, addTopic, updateTopic, completeReview, deleteTopic } =
    useStudyStore();
  const sortedTopics = useSortedTopics(topics);
  const navigate = useNavigate();

  const dashboardCurrent = useMemo(
    () =>
      sortedTopics.needsReview.filter(
        (topic) => topic.currentCycle <= DASHBOARD_MAX_CYCLE_INDEX
      ),
    [sortedTopics.needsReview]
  );
  const dashboardUpcoming = useMemo(
    () =>
      sortedTopics.upcoming.filter(
        (topic) => topic.currentCycle <= DASHBOARD_MAX_CYCLE_INDEX
      ),
    [sortedTopics.upcoming]
  );

  const allTopicsSorted = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (a.currentCycle !== b.currentCycle) {
        return a.currentCycle - b.currentCycle;
      }
      return (
        new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
      );
    });
  }, [topics]);

  const handleOpenTopic = (topic: Topic) => {
    navigate(`/topico/${buildTopicSlug(topic)}`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <AppLayout>
              <DashboardPage
                topics={topics}
                current={dashboardCurrent}
                upcoming={dashboardUpcoming}
                onOpenTopic={handleOpenTopic}
              />
            </AppLayout>
          ) : (
            <AppLayout
              showNavigation={false}
              showAddTopic={false}
              headerActions={
                <div className="flex items-center gap-3">
                  <Link
                    to="/entrar"
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/criar-conta"
                    className="px-3 py-2 rounded-lg border border-indigo-200 text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    Criar conta
                  </Link>
                </div>
              }
            >
              <LandingPage />
            </AppLayout>
          )
        }
      />

      <Route
        path="/entrar"
        element={
          <AppLayout showNavigation={false} showAddTopic={false}>
            <SignInPage />
          </AppLayout>
        }
      />

      <Route
        path="/criar-conta"
        element={
          <AppLayout showNavigation={false} showAddTopic={false}>
            <SignUpPage />
          </AppLayout>
        }
      />

      <Route
        path="/esqueci-senha"
        element={
          <AppLayout showNavigation={false} showAddTopic={false}>
            <ForgotPasswordPage />
          </AppLayout>
        }
      />

      <Route
        path="/cancelar-conta"
        element={
          <AppLayout showNavigation={false} showAddTopic={false}>
            <DeleteAccountPage />
          </AppLayout>
        }
      />

      <Route
        path="/ciclos"
        element={
          isAuthenticated ? (
            <AppLayout>
              <CyclesPage
                topics={allTopicsSorted}
                needsReview={sortedTopics.needsReview}
                onOpenTopic={handleOpenTopic}
              />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/novo"
        element={
          isAuthenticated ? (
            <AppLayout>
              <AddTopicPage onAdd={addTopic} />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/topico/:slug"
        element={
          isAuthenticated ? (
            <AppLayout>
              <TopicDetailsPage
                topics={topics}
                onCompleteReview={completeReview}
                onDelete={deleteTopic}
              />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/topico/:slug/editar"
        element={
          isAuthenticated ? (
            <AppLayout>
              <EditTopicPage topics={topics} onUpdate={updateTopic} />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/temas"
        element={
          isAuthenticated ? (
            <AppLayout>
              <TopicsGroupsPage
                topics={topics}
                needsReview={sortedTopics.needsReview}
                onOpenTopic={handleOpenTopic}
              />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/temas/:slug"
        element={
          isAuthenticated ? (
            <AppLayout>
              <GroupTopicsPage
                topics={topics}
                needsReview={sortedTopics.needsReview}
                onOpenTopic={handleOpenTopic}
              />
            </AppLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
