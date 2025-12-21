import { Link, useNavigate } from 'react-router-dom';
import { AddTopicForm } from '../../features/topics/components/AddTopicForm';

export function AddTopicPage({ onAdd }: { onAdd: (title: string, description: string) => void | Promise<void> }) {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Novo estudo</p>
          <h2 className="text-2xl font-bold text-slate-800">Adicionar tópico</h2>
        </div>
        <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
          Voltar ao dashboard
        </Link>
      </div>
      <AddTopicForm
        onAdd={(title, description) => {
          Promise.resolve(onAdd(title, description))
            .then(() => navigate('/'))
            .catch(() => {});
        }}
      />
    </section>
  );
}
