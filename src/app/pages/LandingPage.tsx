import {
  AlarmClock,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
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

const cyclePreview = [
  {
    title: "Bases de Estatística",
    cycle: "Ciclo 2",
    progress: 72,
    next: "Hoje • 12 cards",
  },
  {
    title: "Fundamentos de Física",
    cycle: "Ciclo 1",
    progress: 54,
    next: "Em 6h • 9 cards",
  },
  {
    title: "Neurociência aplicada",
    cycle: "Ciclo 3",
    progress: 88,
    next: "Amanhã • 5 cards",
  },
];

const expiringSoon = [
  { title: "Memória de Curto Prazo", due: "Em 40min", cards: 6 },
  { title: "Curva de Esquecimento", due: "Em 2h", cards: 4 },
  { title: "Débito de Sono", due: "Hoje à noite", cards: 8 },
  { title: "Tomada de Decisão", due: "Amanhã cedo", cards: 5 },
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

      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm grid gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            Visualize seus ciclos e o que está para vencer
          </h3>
          <p className="text-slate-600">
            Veja rapidamente o que está em andamento e quais revisões precisam
            da sua atenção antes de expirarem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#818cf8,_transparent_40%)]" />
            <div className="relative p-6 flex flex-col gap-3">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                Visualização dos ciclos
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
                {cyclePreview.map((cycle) => (
                  <div
                    key={cycle.title}
                    className="border border-slate-100 rounded-xl p-3 bg-slate-50/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase font-semibold text-indigo-600">
                          {cycle.cycle}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {cycle.title}
                        </p>
                      </div>
                      <CheckCircle2
                        size={18}
                        className="text-emerald-500 shrink-0"
                      />
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        style={{ width: `${cycle.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                      <Clock3 size={14} />
                      <span>{cycle.next}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Acompanhe o andamento de cada ciclo com uma visão clara das
                etapas concluídas e próximas revisões.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#fcd34d,_transparent_40%)]" />
            <div className="relative p-6 flex flex-col gap-3">
              <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                Próximos a vencer
              </p>
              <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm flex flex-col gap-3">
                {expiringSoon.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-3 border border-amber-50 rounded-lg px-3 py-2 bg-amber-50/70"
                  >
                    <div className="flex items-center gap-2">
                      <AlarmClock size={18} className="text-amber-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">
                          {item.title}
                        </span>
                        <span className="text-xs text-amber-700">
                          {item.due}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-3 py-1">
                      {item.cards} cards
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Destaque visual para os ciclos que precisam ser revisados logo,
                ajudando você a priorizar o que importa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
