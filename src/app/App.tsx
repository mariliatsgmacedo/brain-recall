import { useMemo } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useCompleteReviewMutation,
  useDeleteTopicMutation,
} from "./api/topics";
import {
  useLoginMutation,
  useSignupMutation,
  useMeQuery,
  logout as logoutAction,
} from "./api/auth";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { data: me } = useMeQuery(Boolean(token));
  const isAuthenticated = Boolean(token && me);
  const userName = me?.name;
  const userEmail = me?.email;

  // TanStack Query gerencia cache e revalidação dos tópicos autenticados.
  const topicsQuery = useTopicsQuery(Boolean(me));
  const topics = topicsQuery.data || [];
  const sortedTopics = useSortedTopics(topics);

  const createTopic = useCreateTopicMutation();
  const updateTopic = useUpdateTopicMutation();
  const completeReviewMutation = useCompleteReviewMutation();
  const deleteTopicMutation = useDeleteTopicMutation();
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const handleLogout = () => {
    logoutAction();
    queryClient.clear();
    navigate("/entrar");
  };

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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
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
            <SignInPage loginMutation={loginMutation} />
          </AppLayout>
        }
      />

      <Route
        path="/criar-conta"
        element={
          <AppLayout showNavigation={false} showAddTopic={false}>
            <SignUpPage signupMutation={signupMutation} />
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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
              <AddTopicPage
                onAdd={async (title, description) => {
                  await createTopic.mutateAsync({ title, description });
                }}
              />
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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
              <TopicDetailsPage
                topics={topics}
                onCompleteReview={async (id) => {
                  await completeReviewMutation.mutateAsync({ id });
                }}
                onDelete={async (id) => {
                  await deleteTopicMutation.mutateAsync({ id });
                }}
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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
              <EditTopicPage
                topics={topics}
                onUpdate={async (id, data) => {
                  await updateTopic.mutateAsync({
                    id,
                    title: data.title,
                    description: data.description,
                  });
                }}
              />
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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
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
            <AppLayout
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            >
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
