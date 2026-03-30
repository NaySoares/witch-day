# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração do monorepo
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/frontend/package.json ./packages/frontend/

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend

# Build do shared
WORKDIR /app/packages/shared
RUN npm run build

# Build do frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/packages/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
