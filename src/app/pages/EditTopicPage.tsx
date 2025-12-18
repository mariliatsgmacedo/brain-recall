import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import type { Topic } from '../../domain/topic';
import { buildTopicSlug, extractIdFromSlug } from '../utils/topicSlug';

export function EditTopicPage({
  topics,
  onUpdate,
}: {
  topics: Topic[];
  onUpdate: (id: string, data: { title: string; description: string }) => void;
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const topicId = slug ? extractIdFromSlug(slug) : '';
  const topic = topics.find((item) => item.id === topicId);
  const [title, setTitle] = useState(topic?.title ?? '');
  const [description, setDescription] = useState(topic?.description ?? '');

  if (!topic) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-700">Tópico não encontrado</h2>
        <p className="text-sm text-slate-500 mt-2">O tópico que você tentou editar não existe ou foi removido.</p>
        <Link to="/" className="inline-block mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Voltar ao dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Editar estudo</p>
          <h2 className="text-2xl font-bold text-slate-800">Atualizar tópico</h2>
        </div>
        <Link
          to={`/topico/${buildTopicSlug(topic)}`}
          className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Cancelar
        </Link>
      </div>

      <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <input
          type="text"
          placeholder="Título do assunto"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          className="rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
          data-color-mode="light"
        >
          <MDEditor
            value={description}
            onChange={(value) => setDescription(value ?? '')}
            preview="edit"
            height={200}
            textareaProps={{ placeholder: 'Resumo do conteúdo estudado...' }}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={`/topico/${buildTopicSlug(topic)}`}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            onClick={() => {
              if (!title.trim()) return;
              onUpdate(topic.id, { title, description });
              const newSlug = buildTopicSlug({ ...topic, title });
              navigate(`/topico/${newSlug}`);
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50"
            disabled={!title.trim()}
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </section>
  );
}
