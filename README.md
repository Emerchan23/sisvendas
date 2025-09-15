# ERP-BR - Sistema de Gestão Empresarial

Sistema ERP completo desenvolvido em Next.js com backend em Node.js, focado em gestão de vendas, clientes, produtos e relatórios financeiros.

## 🚀 Instalação Automática

Este sistema possui instalação **100% automática**. Basta executar um comando e tudo será configurado automaticamente.

### Pré-requisitos

- **Node.js 18+** (será instalado automaticamente se não estiver presente)
- **Docker** (será instalado automaticamente no Linux, manual no Windows/Mac)

### Instalação em 1 Comando

```bash
npm run setup
```

Ou execute diretamente:

```bash
node install.js
```

### O que a instalação automática faz:

1. ✅ Verifica e instala Node.js (se necessário)
2. ✅ Verifica e instala Docker (se necessário)
3. ✅ Cria diretório de dados externo (`../Banco de dados Aqui/`)
4. ✅ Configura arquivo de ambiente (`.env.local`)
5. ✅ Instala todas as dependências npm
6. ✅ Constrói o projeto
7. ✅ Cria scripts de inicialização

## 🎯 Como Usar

### Desenvolvimento
```bash
npm run start-dev
# ou
npm run dev
```
Acesse: http://localhost:3145

### Produção (Docker)
```bash
npm run start-prod
# ou
docker-compose up --build
```

## 🔧 Diagnóstico e Solução de Problemas

### Script de Diagnóstico
Antes de usar o sistema, execute o diagnóstico para verificar se tudo está funcionando:

```bash
npm run diagnose
```

Este script verifica:
- ✅ Permissões de banco de dados
- ✅ Conectividade SQLite
- ✅ Configuração de rede
- ✅ IPs disponíveis para acesso externo
- ✅ Arquivos importantes do projeto

### 🌐 Acesso de Outros Computadores/IPs

O sistema agora funciona corretamente quando acessado de outros IPs na rede:

**URLs de Acesso:**
- Local: `http://localhost:3145`
- Rede local: `http://[SEU-IP]:3145`
- Exemplo: `http://192.168.1.10:3145`

**Para descobrir seus IPs disponíveis:**
```bash
npm run diagnose
```

### 🗄️ Problemas de Banco de Dados

**Sintomas comuns:**
- ❌ Erro ao salvar dados
- ❌ "Sem acesso ao banco de dados"
- ❌ Dados não persistem após reiniciar

**Soluções:**

1. **Execute o diagnóstico:**
   ```bash
   npm run diagnose
   ```

2. **Verifique permissões:**
   - Execute como administrador (Windows)
   - Verifique permissões da pasta `../Banco de dados Aqui/`

3. **Configure caminho personalizado:**
   ```bash
   # Windows
   set DB_PATH=C:\caminho\personalizado\erp.sqlite
   npm run dev
   
   # Linux/Mac
   export DB_PATH=/caminho/personalizado/erp.sqlite
   npm run dev
   ```

4. **Docker - Volume externo:**
   ```yaml
   # docker-compose.yml já configurado
   volumes:
     - "../Banco de dados Aqui:/data"  # Dados ficam em ../Banco de dados Aqui/ no host
   ```
Acesse: http://localhost:3145

### Comandos Docker
```bash
npm run docker:build    # Construir imagem
npm run docker:up       # Iniciar em background
npm run docker:down     # Parar containers
npm run docker:logs     # Ver logs
```

## 📁 Estrutura do Banco de Dados

- **Localização**: `../Banco de dados Aqui/erp.sqlite`
- **Tipo**: SQLite
- **Status**: **Externo ao Docker** (dados persistem mesmo removendo containers)

## 🔧 Configuração

Todas as configurações estão no arquivo `.env.local` (criado automaticamente):

```env
NEXT_PUBLIC_API_URL=http://localhost:3145
DB_PATH=../Banco de dados Aqui/erp.sqlite
NODE_ENV=development
```

## 🔄 Instalação Limpa (Teste)

Para testar uma instalação completamente limpa:

1. Delete a pasta `node_modules`
2. Delete a pasta `../Banco de dados Aqui`
3. Delete o arquivo `.env.local`
4. Execute: `npm run setup`

## 🚀 Funcionalidades

- **Gestão de Clientes**: Cadastro completo de clientes com histórico de compras
- **Gestão de Produtos**: Controle de estoque e catálogo de produtos
- **Pedidos e Vendas**: Sistema completo de pedidos com controle de status
- **Recebimentos**: Controle financeiro de recebimentos e pagamentos
- **Relatórios**: Dashboards e relatórios detalhados
- **Backup/Restore**: Sistema completo de backup e restauração de dados
- **Multi-empresa**: Suporte a múltiplas empresas

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, SQLite
- **UI Components**: Shadcn/ui, Radix UI
- **Containerização**: Docker, Docker Compose
- **Banco de Dados**: SQLite com suporte a múltiplas empresas

## 📦 Instalação

### Usando Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/Emerchan23/finantest.git
cd finantest

# Execute com Docker Compose
docker-compose up --build
```

### Instalação Manual

```bash
# Clone o repositório
git clone https://github.com/Emerchan23/finantest.git
cd finantest

# Instale as dependências
npm install

# Execute o backend
cd backend
npm start

# Em outro terminal, execute o frontend
npm run dev
```

## 🌐 Acesso

- **Sistema**: http://localhost:3145

## 📊 Estrutura do Projeto

```
├── app/                    # Páginas Next.js (App Router)
├── backend/               # API Node.js/Express
├── components/            # Componentes React reutilizáveis
├── lib/                   # Utilitários e configurações
├── public/                # Arquivos estáticos
├── docker-compose.yml     # Configuração Docker
└── README.md             # Este arquivo
```

## 🔧 Configuração

O sistema utiliza SQLite como banco de dados padrão. As configurações podem ser ajustadas nos arquivos:

- `backend/config.js` - Configurações do backend
- `lib/config.ts` - Configurações do frontend

## 💾 Backup e Restauração

O sistema possui funcionalidade completa de backup:

- **Exportar**: Gera arquivo JSON com todos os dados
- **Importar**: Restaura dados com opção de merge ou substituição
- **Dados inclusos**: Clientes, produtos, pedidos, recebimentos, configurações

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🔧 Correções e Melhorias

### Correção da Coluna item_id (Janeiro 2025)

**Problema Identificado:**
- Erro HTTP 500 ao salvar orçamentos: "table orcamento_itens has no column named item_id"
- Inconsistência entre o código da API que esperava a coluna `item_id` e o schema do banco que só possuía `produto_id`

**Solução Aplicada:**
- ✅ Adicionada coluna `item_id` (TEXT) na tabela `orcamento_itens`
- ✅ Mantida compatibilidade com dados existentes (coluna `produto_id` preservada)
- ✅ Migração automática de dados existentes
- ✅ Testes de integridade validados
- ✅ Sistema de salvamento de orçamentos funcionando corretamente

**Arquivos Afetados:**
- `app/api/orcamentos/route.ts` - API principal de orçamentos
- `app/api/orcamentos/[id]/route.ts` - API específica por ID
- `components/orcamento-form.tsx` - Formulário de orçamentos
- Schema da tabela `orcamento_itens` no banco SQLite

**Scripts de Correção:**
- `fix-item-id-column.js` - Script de migração do schema
- `test-orcamento-save.js` - Teste de validação da correção
- `check-data-integrity.js` - Verificação de integridade dos dados

**Status:** ✅ Corrigido e testado com sucesso

## 📞 Suporte

Para suporte e dúvidas, abra uma issue no GitHub.