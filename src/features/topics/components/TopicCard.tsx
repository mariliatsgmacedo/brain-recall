import { Calendar, ChevronRight, History, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Topic } from '../../../domain/topic';
import { Badge } from '../../../components/ui/Badge';

type Variant = 'due' | 'upcoming';

export function TopicCard({ topic, variant, onClick }: { topic: Topic; variant: Variant; onClick: () => void }) {
  if (variant === 'due') {
    return (
      <div
        onClick={onClick}
        className="bg-white border-2 border-amber-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-lg">{topic.title}</h3>
            <Badge variant="urgent">AGORA</Badge>
          </div>
          <p className="text-slate-500 text-sm line-clamp-1 mb-2">{topic.description || 'Sem descrição...'}</p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1 text-amber-600">
              <Calendar size={14} /> Venceu {format(new Date(topic.nextReview), 'dd/MM', { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1">
              <History size={14} /> Ciclo R{topic.currentCycle + 1}
            </span>
          </div>
        </div>
        <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors hidden md:block" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all group"
    >
      <div className="flex-1">
        <h3 className="font-bold text-slate-700">{topic.title}</h3>
        <div className="flex gap-4 mt-1 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {format(new Date(topic.nextReview), 'dd/MM/yyyy')}
          </span>
          <span className="flex items-center gap-1 text-indigo-500">
            <Clock size={14} /> {differenceInDays(new Date(topic.nextReview), new Date())} dias
          </span>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-200 group-hover:text-indigo-300" />
    </div>
  );
}

