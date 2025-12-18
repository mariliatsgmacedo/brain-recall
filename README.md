# BrainRecall (Spaced Repetition)

App simples de revisão espaçada (Ebbinghaus) para cadastrar tópicos de estudo e revisar em ciclos (1, 7, 15, 30 dias), persistindo tudo no `localStorage`.

## Rodar o projeto

```bash
npm install
npm run dev
```

## Estrutura de pastas

- `src/app/App.tsx`: composição da UI e fluxo principal
- `src/domain/*`: regras de domínio (intervalos e tipos)
- `src/store/useStudyStore.ts`: Zustand store (persistência + ações)
- `src/components/ui/*`: componentes de UI reutilizáveis (`Modal`, `Badge`)
- `src/features/topics/*`: componentes e hooks do “feature” de tópicos

## Build

```bash
npm run build
```
