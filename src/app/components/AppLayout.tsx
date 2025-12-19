import type { ReactNode } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isCyclesPage = location.pathname === "/ciclos";
  const isGroupedPage = location.pathname.startsWith("/temas");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BrainRecall</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-3 text-sm font-semibold">
              <Link
                to="/"
                className={`hover:text-indigo-600 transition-colors ${
                  !isCyclesPage && !isGroupedPage
                    ? "text-indigo-600"
                    : "text-slate-600"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/ciclos"
                className={`hover:text-indigo-600 transition-colors ${
                  isCyclesPage ? "text-indigo-600" : "text-slate-600"
                }`}
              >
                Ciclos
              </Link>
              <Link
                to="/temas"
                className={`hover:text-indigo-600 transition-colors ${
                  isGroupedPage ? "text-indigo-600" : "text-slate-600"
                }`}
              >
                Agrupados
              </Link>
              <Link
                to="/novo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                Adicionar tópico
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
