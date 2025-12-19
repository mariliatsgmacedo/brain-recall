import { useState, type ReactNode } from "react";
import { LogOut, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import icon from "../../assets/icon.svg";
import { useAuthStore } from "../../store/useAuthStore";

export function AppLayout({
  children,
  showNavigation = true,
  headerActions,
  showAddTopic = true,
}: {
  children: ReactNode;
  showNavigation?: boolean;
  headerActions?: ReactNode;
  showAddTopic?: boolean;
}) {
  const { account, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const isCyclesPage = location.pathname === "/ciclos";
  const isGroupedPage = location.pathname.startsWith("/temas");
  const navItems = [
    {
      label: "Dashboard",
      to: "/",
      active: !isCyclesPage && !isGroupedPage,
    },
    {
      label: "Ciclos",
      to: "/ciclos",
      active: isCyclesPage,
    },
    {
      label: "Agrupados",
      to: "/temas",
      active: isGroupedPage,
    },
  ];
  const userInitial =
    account?.name?.charAt(0)?.toUpperCase() ||
    account?.email?.charAt(0)?.toUpperCase() ||
    "?";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsConfirmOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={icon}
                alt="Ícone BrainRecall"
                className="w-10 h-10 rounded-lg border border-indigo-100 bg-white object-contain shadow-sm"
              />
              <div className="leading-tight">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  BrainRecall
                </p>
              </div>
              {showNavigation ? (
                <div className="flex items-center justify-between gap-3">
                  <nav className="flex items-center gap-2 text-sm font-semibold p-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          item.active
                            ? "bg-white text-indigo-600"
                            : "text-slate-600 hover:text-indigo-600 hover:bg-white/60"
                        }`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {headerActions}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 px-3 py-2 relative">
                  {showAddTopic ? (
                    <Link
                      to="/novo"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus size={16} />
                      Adicionar tópico
                    </Link>
                  ) : null}
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold flex items-center justify-center">
                        {userInitial}
                      </div>
                    </button>
                    {isMenuOpen ? (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-20">
                        <button
                          onClick={handleLogoutClick}
                          className="w-full inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={14} />
                          Sair
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      {isConfirmOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Confirmar logout
                </p>
                <p className="text-sm text-slate-600">
                  Deseja sair da sua conta agora?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
