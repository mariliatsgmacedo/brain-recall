import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export function SignInPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = login(email.trim(), password);
    if (result.success) {
      setError(null);
      navigate('/');
      return;
    }
    setError(result.error || 'Não foi possível entrar.');
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Entrar</h2>
      <p className="text-sm text-slate-500 mb-4">Acesse seus ciclos usando a conta deste dispositivo.</p>

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
          <span className="text-slate-600 font-semibold">Senha</span>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          className="w-full mt-2 rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 transition-colors"
        >
          Entrar
        </button>
      </form>

      <div className="text-sm text-slate-500 mt-4 flex flex-col gap-2">
        <Link to="/criar-conta" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Criar uma conta
        </Link>
        <Link to="/esqueci-senha" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Esqueci minha senha
        </Link>
        <Link to="/cancelar-conta" className="text-indigo-600 font-semibold hover:text-indigo-700">
          Cancelar/Excluir conta
        </Link>
      </div>
    </div>
  );
}
