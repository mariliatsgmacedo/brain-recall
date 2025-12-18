import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { REVIEW_INTERVALS_DAYS } from '../../domain/review';

export function AppLayout({ children, topicsCount }: { children: ReactNode; topicsCount: number }) {
  const location = useLocation();
  const isCyclesPage = location.pathname === '/ciclos';

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
            <Link
              to={isCyclesPage ? '/' : '/ciclos'}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {isCyclesPage ? 'Voltar ao dashboard' : 'Ver todos os ciclos'}
            </Link>
            <Badge variant="info">{topicsCount} tópicos ativos</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>

      <footer className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-400 text-xs border-t border-slate-200 mt-12">
        Baseado na curva de retenção de Ebbinghaus • R1({REVIEW_INTERVALS_DAYS[0]}d), R7({REVIEW_INTERVALS_DAYS[1]}d),
        R15({REVIEW_INTERVALS_DAYS[2]}d), R30({REVIEW_INTERVALS_DAYS[3]}d).
      </footer>
    </div>
  );
}
