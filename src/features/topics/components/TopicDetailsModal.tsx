import { CheckCircle, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Topic } from '../../../domain/topic';
import { Modal } from '../../../components/ui/Modal';

export function TopicDetailsModal({
  topic,
  onClose,
  onCompleteReview,
  onDelete,
}: {
  topic: Topic | null;
  onClose: () => void;
  onCompleteReview: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Modal isOpen={!!topic} onClose={onClose} title="Detalhes do Conteúdo">
      {topic && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <FileText size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Resumo do Estudo</span>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {topic.description || 'Nenhuma descrição fornecida para este tópico.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Próxima Revisão</span>
              <span className="text-sm font-semibold text-slate-700">{format(new Date(topic.nextReview), 'dd/MM/yyyy')}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ciclo Atual</span>
              <span className="text-sm font-semibold text-slate-700">R{topic.currentCycle + 1}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                onCompleteReview(topic.id);
                onClose();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all"
            >
              <CheckCircle size={20} />
              Marcar como Revisado
            </button>

            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este tópico?')) {
                  onDelete(topic.id);
                  onClose();
                }
              }}
              className="w-full py-3 bg-white hover:bg-red-50 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-transparent hover:border-red-100"
            >
              <Trash2 size={18} />
              Excluir Tópico
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

