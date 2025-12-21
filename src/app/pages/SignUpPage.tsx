import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UseMutationResult } from '@tanstack/react-query';

interface Props {
  signupMutation: UseMutationResult<
    { access_token: string; token_type: string },
    Error,
    { name: string; email: string; password: string }
  >;
}

export function SignUpPage({ signupMutation }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    signupMutation
      .mutateAsync({ name: name.trim(), email: email.trim(), password })
      .then(() => {
        setError(null);
        navigate('/');
      })
      .catch((err) => setError(err.message || 'Não foi possível criar a conta.'));
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Criar conta</h2>
      <p className="text-sm text-slate-500 mb-4">Use uma conta por dispositivo para manter seus estudos organizados.</p>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600 font-semibold">Nome</span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
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
          <span className="text-slate-600 font-semibold">Senha</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            maxLength={72}
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-slate-600 font-semibold">Confirme a senha</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
            maxLength={72}
          />
        </label>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {signupMutation.isPending ? (
          <p className="text-sm text-slate-500">Criando conta...</p>
        ) : null}

        <button
          type="submit"
          className="w-full mt-2 rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 transition-colors"
        >
          Criar conta
        </button>
      </form>

      <div className="text-sm text-slate-500 mt-4 flex flex-col gap-2">
        <Link to="/entrar" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Já tenho conta
        </Link>
        <Link to="/esqueci-senha" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
}
