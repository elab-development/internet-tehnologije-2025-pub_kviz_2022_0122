# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

COPY package.json package-lock.json* ./
RUN npm install --no-fund --no-audit

COPY . .
RUN npm run build
RUN npx esbuild src/db/seed.ts --bundle --platform=node --outfile=dist/seed.cjs

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/db/schema.ts ./src/db/schema.ts
COPY --from=builder /app/dist/seed.cjs ./dist/seed.cjs

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "server.js"]