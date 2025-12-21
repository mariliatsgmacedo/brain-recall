import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteAccountMutation } from '../api/auth';

export function DeleteAccountPage() {
  const deleteAccountMutation = useDeleteAccountMutation();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState('');

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault();
    if (confirmation.trim().toLowerCase() !== 'excluir') return;
    deleteAccountMutation
      .mutateAsync()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-rose-600 mb-2">Cancelar/Excluir conta</h2>
      <p className="text-sm text-slate-500 mb-4">
        Remova os dados de conta e estudos deste dispositivo. Essa ação limpa os tópicos salvos no armazenamento local.
      </p>

      <div className="bg-rose-50 text-rose-700 text-sm rounded-xl p-3 mb-4">
        Digite <strong className="font-semibold">excluir</strong> para confirmar.
      </div>

      <form className="grid gap-3" onSubmit={handleDelete}>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600 font-semibold">Confirmação</span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="excluir"
            required
          />
        </label>

        <button
          type="submit"
          disabled={confirmation.trim().toLowerCase() !== 'excluir'}
          className="w-full mt-2 rounded-xl bg-rose-600 text-white font-semibold py-2.5 hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Excluir conta e dados
        </button>
      </form>

      <div className="text-sm text-slate-500 mt-4 flex flex-col gap-1">
        <p className="text-slate-600">
          Conta atual: <strong>sessão autenticada</strong>
      </p>
        <Link to="/entrar" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Voltar
        </Link>
      </div>
    </div>
  );
}
