import { Plus } from 'lucide-react';
import { useState } from 'react';

export function AddTopicForm({ onAdd }: { onAdd: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <section className="mb-12 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Adicionar Novo Estudo</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onAdd(title, description);
          setTitle('');
          setDescription('');
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Título do assunto (ex: Banco de Dados)"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Resumo do conteúdo estudado..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Salvar Tópico
        </button>
      </form>
    </section>
  );
}

