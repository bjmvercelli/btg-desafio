# 🔐 BTG OTP API

API de Gerenciamento de OTP (*One-Time Password*) desenvolvida para o desafio técnico do BTG.

## 📋 Descrição

Esta API REST permite a criação e validação de tokens OTP, seguindo os princípios de Clean Architecture.

## ✨ Funcionalidades

- ✅ **Criar Token OTP**: Gera tokens únicos de 6 dígitos
- ✅ **Validar Token OTP**: Valida tokens com verificação de expiração e uso
- ✅ **Arquitetura Limpa**: Implementação seguindo Clean Architecture
- ✅ **Banco de Dados**: SQLite para persistência
- ✅ **Documentação**: Swagger integrado
- ✅ **Logs**: Sistema de logs com Winston
- ✅ **Testes**: Testes unitários com Jest
- ✅ **Containerização**: Docker e Docker Compose
- ✅ **Configuração**: Variáveis de ambiente configuráveis

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** com as seguintes camadas:

```
src/
├── domain/           # Entidades
├── application/      # Casos de uso
├── infrastructure/   # Implementações externas (DB, HTTP, etc.)
└── __tests__/        # Testes automatizados
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional)

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/bjmvercelli/btg-desafio.git
   cd btg-desafio
   ```

2. **Instale as dependências**
   ```bash
   yarn
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   # Edite o arquivo .env conforme necessário
   ```

4. **Execute a aplicação**
   ```bash
   # Desenvolvimento
   yarn dev
   
   # Produção
   yarn build
   yarn start
   ```

### Docker

1. **Build e execute com Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Ou apenas com Docker**
   ```bash
   docker build -t btg-otp-api .
   docker run -p 3000:3000 btg-otp-api
   ```

## 📚 Documentação da API

A documentação interativa está disponível em:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `OTP_EXPIRATION_TIME` | Tempo de expiração em ms | `300000` (5 min) |
| `OTP_LENGTH` | Comprimento do token | `6` |
| `DB_PATH` | Caminho do banco SQLite | `./database/otp.db` |
| `LOG_LEVEL` | Nível de logs | `info` |

## 🧪 Testes

```bash
# Executar todos os testes
yarn test

# Executar testes em modo watch
yarn test:watch

# Executar testes com cobertura
yarn test:coverage
```

## 📝 Logs

Os logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

## 🔒 Segurança

- **Helmet.js**: Headers de segurança
- **CORS**: Configuração de CORS
- **Validação**: Validação de entrada com Joi
- **Sanitização**: Sanitização de dados de entrada

## 📊 Monitoramento

- **Health Check**: `/health` para verificação de status
- **Logs estruturados**: Logs em formato JSON
- **Métricas**: Endpoint de health com timestamp

## 🚀 Deploy

### Produção com Docker

```bash
# Build da imagem
docker build -t btg-otp-api:latest .

# Execução
docker run -d \
  --name btg-otp-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd)/database:/app/database \
  -v $(pwd)/logs:/app/logs \
  btg-otp-api:latest
```

### Docker Compose (Recomendado)

```bash
docker-compose up -d
```