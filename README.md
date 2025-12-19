# BrainRecall (Revisão Espaçada)

## Sobre o Projeto

BrainRecall é uma aplicação web simples e eficaz para implementar a técnica de **revisão espaçada** (baseada na curva de esquecimento de Ebbinghaus). A revisão espaçada é um método de estudo que otimiza a retenção de conhecimento ao programar revisões em intervalos crescentes de tempo (1, 7, 15 e 30 dias), permitindo que os usuários revisem tópicos de estudo de forma mais eficiente e com menos esforço.

O app permite cadastrar tópicos de estudo, organizá-los em grupos e acompanhar o progresso das revisões. Todos os dados são persistidos localmente no `localStorage`, garantindo simplicidade e privacidade, sem necessidade de conta ou servidor.

### Benefícios da Revisão Espaçada
- **Melhora a retenção**: Estudos mostram que revisar informações em intervalos otimizados aumenta a memória de longo prazo.
- **Economia de tempo**: Foca em tópicos que precisam de revisão, evitando revisões desnecessárias.
- **Flexibilidade**: Funciona offline e é acessível em qualquer dispositivo com navegador.

## Funcionalidades

- **Cadastro de Tópicos**: Adicione tópicos de estudo com título, descrição e grupo.
- **Ciclos de Revisão**: Revisões automáticas em 1, 7, 15 e 30 dias após a criação ou última revisão.
- **Organização por Grupos**: Agrupe tópicos relacionados para melhor organização.
- **Dashboard**: Visualize tópicos pendentes e concluídos.
- **Persistência Local**: Dados salvos no navegador, sem necessidade de backend.

## Tecnologias Utilizadas

O projeto foi desenvolvido com tecnologias modernas e justificadas para garantir performance, manutenibilidade e experiência do usuário:

- **React**: Framework para construção de interfaces de usuário componentizadas, permitindo reutilização e modularidade.
- **TypeScript**: Adiciona tipagem estática ao JavaScript, reduzindo bugs e melhorando a produtividade durante o desenvolvimento.
- **Vite**: Ferramenta de build rápida e leve, ideal para projetos front-end modernos, com hot-reload e otimização automática.
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida e consistente, sem necessidade de arquivos CSS customizados extensos.
- **Zustand**: Biblioteca de gerenciamento de estado leve e simples, escolhida pela sua facilidade de uso e integração com React, sem boilerplate excessivo.
- **LocalStorage**: Solução de persistência simples e nativa do navegador, adequada para apps offline sem complexidade de bancos de dados.

Essas escolhas priorizam a simplicidade, performance e facilidade de manutenção, alinhadas ao escopo de um app pessoal de estudo.

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para Rodar
1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd space-study-all
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

   O app estará disponível em `http://localhost:5173` (porta padrão do Vite).

## Estrutura do Projeto

A organização do código segue princípios de arquitetura limpa e separação de responsabilidades:

- `src/app/`: Componentes principais da aplicação e configuração.
- `src/domain/`: Regras de negócio e tipos de domínio (ex.: intervalos de revisão, estruturas de tópicos).
- `src/store/`: Gerenciamento de estado com Zustand, incluindo persistência.
- `src/components/ui/`: Componentes de UI reutilizáveis (ex.: Modal, Badge).
- `src/features/`: Funcionalidades específicas, como tópicos e pomodoro, organizadas por feature.
- `src/utils/`: Utilitários auxiliares (ex.: geração de slugs, paginação).

## Funcionalidades Futuras

Planejo expandir o BrainRecall com as seguintes melhorias:

- **Autenticação de Usuário**: Permitir contas para sincronização entre dispositivos.
- **Sincronização na Nuvem**: Backup e restauração de dados via serviços como Firebase ou Supabase.
- **Notificações**: Lembretes automáticos para revisões pendentes (usando Notification API ou push notifications).
- **Modo Pomodoro Integrado**: Temporizador integrado para sessões de estudo focadas.
- **Intervalos Customizáveis**: Permitir ajustes nos ciclos de revisão conforme preferências do usuário.
- **Tema Dark/Light**: Alternância de temas para melhor experiência visual.

## Build para Produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`, prontos para deploy em qualquer servidor estático.

