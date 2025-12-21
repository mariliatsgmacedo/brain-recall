import { ShieldCheck, Sparkles, Users } from "lucide-react";
import logo from "../../assets/logo.svg";
import icon from "../../assets/icon.svg";

const features = [
  {
    title: "Ciclos inteligentes",
    description: "Revise no momento certo seguindo a curva de esquecimento.",
    icon: <ShieldCheck className="text-indigo-500" size={18} />,
  },
  {
    title: "Organização por temas",
    description: "Separe seus estudos por grupos e acompanhe a evolução.",
    icon: <Users className="text-indigo-500" size={18} />,
  },
  {
    title: "Integração com IA futura",
    description:
      "Você vai poder gerar resumos e gerar perguntas sobre o assunto a ser estudado.",
    icon: <Sparkles className="text-indigo-500" size={18} />,
  },
];

export function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid md:grid-cols-2 gap-10 items-center bg-gradient-to-r from-indigo-50 via-white to-indigo-100 border border-indigo-100 rounded-3xl p-8 shadow">
        <div className="grid gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={icon}
              alt="Ícone BrainRecall"
              className="h-12 w-12 rounded-xl border border-indigo-100 bg-white object-contain shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                BrainRecall
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Revisão espaçada simples
              </h1>
            </div>
          </div>
          <p className="text-slate-600">
            Cadastre tópicos, acompanhe ciclos e revise no tempo certo. Use os
            botões no topo para entrar ou criar sua conta e começar agora mesmo.
          </p>
        </div>
        <div className="relative h-full min-h-[360px] flex items-center justify-center">
          <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 blur-3xl opacity-10" />
          <div className="relative  rounded-3xl p-8 flex flex-col items-center text-center gap-4 w-full">
            <img
              src={logo}
              alt="Logo BrainRecall"
              className="w-full max-w-md object-contain drop-shadow"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm grid gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
            Reforce a memória com ciclos de revisão prontos para sincronizar.
          </h2>
          <p className="text-slate-600">
            Entenda rapidamente como a plataforma organiza seu aprendizado em
            revisões distribuídas e sempre no tempo certo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-start shadow-sm"
            >
              <div className="p-2 bg-white border border-indigo-100 rounded-xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
