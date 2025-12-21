import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../api/auth';

export function ForgotPasswordPage() {
  const resetPassword = useResetPasswordMutation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    resetPassword
      .mutateAsync({ email: email.trim(), newPassword })
      .then(() => {
        setError(null);
        setMessage('Senha atualizada! Você pode entrar novamente.');
        setTimeout(() => navigate('/entrar'), 800);
      })
      .catch((err) => {
        setMessage(null);
        setError(err.message || 'Não foi possível alterar a senha.');
      });
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Esqueceu a senha</h2>
      <p className="text-sm text-slate-500 mb-4">
        Informe o e-mail cadastrado e defina uma nova senha para continuar usando o app.
      </p>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600 font-semibold">E-mail</span>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600 font-semibold">Nova senha</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={6}
            maxLength={72}
          />
        </label>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {resetPassword.isPending ? <p className="text-sm text-slate-500">Enviando...</p> : null}

        <button
          type="submit"
          className="w-full mt-2 rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 transition-colors"
        >
          Atualizar senha
        </button>
      </form>

      <div className="text-sm text-slate-500 mt-4 flex flex-col gap-2">
        <Link to="/entrar" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Voltar para login
        </Link>
        <Link to="/criar-conta" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Criar nova conta
        </Link>
      </div>
    </div>
  );
}
