# BrainRecall (Revisão Espaçada)

## Sobre o Projeto

BrainRecall é uma aplicação web para implementar a técnica de **revisão espaçada** (baseada na curva de esquecimento de Ebbinghaus). A revisão espaçada otimiza a retenção de conhecimento ao programar revisões em intervalos crescentes de tempo (1, 7, 15 e 30 dias), permitindo que os usuários revisem tópicos de estudo de forma mais eficiente.

O app permite cadastrar tópicos de estudo, organizá-los em grupos, acompanhar o progresso das revisões e gerenciar contas de usuário. Os dados são persistidos no backend via API, garantindo sincronização entre dispositivos e privacidade.

### Benefícios da Revisão Espaçada
- **Melhora a retenção**: Estudos mostram que revisar informações em intervalos otimizados aumenta a memória de longo prazo.
- **Economia de tempo**: Foca em tópicos que precisam de revisão, evitando revisões desnecessárias.
- **Sincronização**: Dados salvos no servidor, acessíveis de qualquer dispositivo.

## Funcionalidades

- **Autenticação de Usuários**: Registro, login e gerenciamento de contas.
- **Cadastro de Tópicos**: Adicione tópicos de estudo com título, descrição e grupo.
- **Ciclos de Revisão**: Revisões automáticas em 1, 7, 15 e 30 dias após a criação ou última revisão.
- **Organização por Grupos**: Agrupe tópicos relacionados para melhor organização.
- **Dashboard**: Visualize tópicos pendentes e concluídos.
- **Persistência via API**: Dados salvos no backend, com sincronização.

## Tecnologias Utilizadas

O projeto foi desenvolvido com tecnologias modernas:

- **React**: Framework para interfaces de usuário.
- **TypeScript**: Tipagem estática para JavaScript.
- **Vite**: Ferramenta de build rápida.
- **Tailwind CSS**: Framework CSS utility-first.
- **Zustand**: Gerenciamento de estado leve.
- **Axios**: Para chamadas à API do backend.

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend rodando (veja README do backend)

### Passos para Rodar
1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd space-study-all/frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

   O app estará disponível em `http://localhost:5173`.

Certifique-se de que o backend esteja rodando em `http://localhost:8000` para que a integração funcione.
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

   O app estará disponível em `http://localhost:5173`.

Certifique-se de que o backend esteja rodando em `http://localhost:8000` para que a integração funcione.

## Configuração Completa

Para rodar a aplicação completa, você precisa tanto do frontend quanto do backend.

1. Siga as instruções no README do backend para iniciar a API.
2. Em seguida, siga os passos acima para o frontend.

## Estrutura do Projeto

A organização do código segue princípios de arquitetura limpa e separação de responsabilidades:

- `src/app/`: Componentes principais da aplicação e configuração.
- `src/domain/`: Regras de negócio e tipos de domínio (ex.: intervalos de revisão, estruturas de tópicos).
- `src/store/`: Gerenciamento de estado com Zustand, integrado com a API do backend.
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

