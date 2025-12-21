import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";

interface Props {
  loginMutation: UseMutationResult<
    { access_token: string; token_type: string },
    Error,
    { email: string; password: string }
  >;
}

export function SignInPage({ loginMutation }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loginMutation
      .mutateAsync({ email: email.trim(), password })
      .then(() => {
        setError(null);
        navigate("/");
      })
      .catch((err) => setError(err.message || "Não foi possível entrar."));
  };

  return (
    <div className="flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Entrar</h2>

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
            {loginMutation.isPending ? (
              <p className="text-sm text-slate-500">Entrando...</p>
            ) : null}

            <button
              type="submit"
              className="w-full mt-2 rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="text-sm text-slate-500 mt-4 flex flex-col gap-2 items-center">
            <button
              onClick={() => navigate("/criar-conta")}
              className="w-full border border-indigo-600 text-indigo-600 bg-white font-semibold py-2 px-4 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Criar uma conta
            </button>
            <Link
              to="/esqueci-senha"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
