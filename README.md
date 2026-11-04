# Soulie — Sprint 04

Plataforma web gamificada de hábitos sustentáveis. O usuário cuida de uma planta virtual (o Soulie), cumpre missões validadas por foto, participa de um jardim comunitário e conversa com a Soulie IA.

Este repositório é o **front-end** da Sprint 04 (Front-End Design Engineering — FIAP), em React + Vite + TypeScript, consumindo a API Java do grupo (Domain Driven Design Using Java).

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| React 19 | Interface |
| Vite 8 | Build e dev server |
| TypeScript | Tipagem estática (`interface`, union e intersection) |
| Tailwind CSS 4 | Estilização e responsividade (`sm:`, `md:`, `lg:`, `xl:`) |
| React Router DOM | Rotas estáticas e dinâmicas (`/integrante/:id`, `/missao/:id`, `/recompensa/:id`) |
| React Hook Form | Formulários de login, cadastro e contato |
| Lucide React | Ícones |
| Fetch nativo | Camada `src/api` — **sem Axios** |

## Estrutura de pastas

```
Soulie-project-v3/
├── public/                 # fotos da equipe, hero, screenshots
├── src/
│   ├── api/                # client HTTP e endpoints
│   ├── components/         # Layout, Header, Card, Soulie, PageStatus
│   ├── constants/          # equipe, FAQ, mapa de plantas
│   ├── context/            # AuthContext (JWT)
│   ├── pages/              # uma página por rota
│   ├── App.tsx
│   └── index.css           # tokens nature-* e animações
├── package.json
└── README.md
```

## Autores e créditos

Turmas **1TDSPY** e **1TDSPV** — FIAP 2026  
Disciplina: Front-End Design Engineering

| Foto | Nome | RM | Turma | GitHub | LinkedIn |
|:---:|---|---|---|---|---|
| ![Laura](public/laura.jpeg) | Laura Albuquerque Gama | RM 571296 | 1TDSPY | [GitHub](https://github.com/Lagsystems) | [LinkedIn](https://www.linkedin.com/in/laura-albuquerque-gama-b83382357/) |
| ![Hugo](public/hugo.jpeg) | Hugo Leite Chimendes | RM 572104 | 1TDSPY | [GitHub](https://github.com/urgho) | [LinkedIn](https://www.linkedin.com/in/hugo-chimendes/) |
| ![Pietro](public/pietro.jpeg) | Pietro Santos de Oliveira | RM 572934 | 1TDSPV | [GitHub](https://github.com/PietroSantosOli) | [LinkedIn](https://www.linkedin.com/in/pietro-santos-586a2a30b/) |
| ![Nathan](public/ntc.jpeg) | Nathan Reis | RM 569520 | 1TDSPV | [GitHub](https://github.com/nathantoneto) | [LinkedIn](https://www.linkedin.com/in/nathan-toneto-a45946395/) |
| ![Arthur](public/arthur.jpeg) | Arthur Zambão Leite | RM 574150 | 1TDSPY | [GitHub](https://github.com/ArthurZambao) | [LinkedIn](https://www.linkedin.com/in/arthurzambao/) |

## Imagens do projeto

![Home](public/Captura%20de%20tela%20Home.png)

*Página inicial*

![Dashboard](public/Captura%20de%20tela%20Dashboard.png)

*Dashboard integrado à API Java*

![Sobre](public/Captura%20de%20tela%20Sobre.png)

*Sobre o projeto*

## Como usar

### Pré-requisitos

- Node.js 18+
- API Java do Soulie publicada (ou rodando local na porta 8080)

### Instalação

```bash
git clone https://github.com/Nexus-Solution-FIAP/Soulie-project-v3.git
cd Soulie-project-v3
cp .env.example .env
# ajuste VITE_API_URL para a URL remota da API (ou mantenha http://localhost:8080)
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

Senha de exemplo da API: `Soulie@2026` (8 caracteres, maiúscula, minúscula, número e símbolo).

### Links da entrega

- Repositório GitHub: [https://github.com/Nexus-Solution-FIAP/Soulie-project-v3](https://github.com/Nexus-Solution-FIAP/Soulie-project-v3)
- Vídeo no YouTube: https://youtu.be/743BkBS8Bsw
- Front na Vercel: _preencher após o deploy_
- **API Java publicada:** _preencher com a URL remota_ (ex.: Render)

No deploy da Vercel, configure `VITE_API_URL` com a URL da API. No back-end, acrescente a origem da Vercel em `CORS_ALLOWED_ORIGINS`.

### Rotas principais

| Rota | Tipo |
|---|---|
| `/` `/sobre` `/integrantes` `/faq` `/contato` | públicas |
| `/integrante/:id` | dinâmica (equipe) |
| `/login` `/cadastro` | auth |
| `/dashboard` `/jardim` `/chat` `/recompensas` `/perfil` | JWT |
| `/missao/:id` `/recompensa/:id` | dinâmica + API |

## Contato

- E-mail: nathantoneto@gmail.com
- Telefone: +55 11 94809-9001
- Formulário: rota `/contato`

---

Soulie — FIAP 2026
