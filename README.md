# 🚗 AquaClean — Sistema de Assinaturas Lava Jato

Sistema completo de assinaturas para lava jato com React + Vite.

## 🚀 Como rodar

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev

# 3. Acesse em http://localhost:5173
```

## 📱 Telas disponíveis

### 🌐 Landing Page (público)
- Apresentação dos planos (Basic, Standard, Premium)
- Formulário de cadastro e assinatura
- Link para área do cliente e admin

### 👤 Área do Cliente
- Login com e-mail cadastrado
- Visualização do plano ativo
- Lavagens restantes no mês
- Histórico de lavagens

### 🔧 Painel Admin
- Senha padrão: **admin123**
- Lista de todos os clientes
- Registrar lavagem para um cliente
- Ativar/desativar assinaturas
- Remover clientes
- Resumo com receita mensal e estatísticas por plano

## 📦 Planos

| Plano    | Lavagens | Preço       |
|----------|----------|-------------|
| Basic    | 1/mês    | R$ 49,90    |
| Standard | 4/mês    | R$ 129,90   |
| Premium  | Ilimitadas | R$ 249,90 |

## 💾 Armazenamento

Os dados são salvos no **localStorage** do navegador. Para produção, substitua por uma API + banco de dados.

## 🛠️ Stack

- React 18
- Vite 5
- React Router DOM
- Lucide React (ícones)
- CSS puro com variáveis (sem Tailwind)

## 🎨 Design

- Tema escuro (dark mode)
- Fontes: Bebas Neue (display) + DM Sans (corpo)
- Paleta: fundo escuro (#0a0a0a) + accent ciano (#00d4ff)
