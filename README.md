# 🍺 Pub Kviz

Pub Kviz je web aplikacija koja omogućava organizaciju i praćenje pub kviz takmičenja. Korisnici se mogu registrovati i prijaviti na platformu, pridružiti se timovima ili kreirati sopstveni tim, učestvovati u takmičenjima po sezonama, te pratiti rang listu svih timova. Kapiten tima ima posebne privilegije — može prijaviti tim na takmičenje i upravljati zahtevima za članstvo.

---

## 🛠️ Tehnologije

| Sloj | Tehnologije |
|------|-------------|
| Frontend | React 19, Next.js 16, Tailwind CSS 4, TypeScript |
| Backend | Next.js API rute, NextAuth, JWT (jose / jsonwebtoken) |
| Baza podataka | PostgreSQL, Drizzle ORM |
| Dokumentacija | Swagger (swagger-jsdoc + swagger-ui-react) |
| Testiranje | Vitest, Jest, Playwright, Testing Library |
| Deployment | Vercel (aplikacija), Neon (baza podataka) |

---

## 🚀 Instalacija i pokretanje

### Preduslovi

- [Docker](https://www.docker.com/) i Docker Compose
- Node.js 20+ (opciono, za lokalni razvoj bez Dockera)

### Environment varijable za docker

Za rad unutar Docker kontejnera, kreiraj `.env.docker` fajl. Primeti da DATABASE_URL koristi db (ime servisa iz docker-compose.yml) umesto localhost:
  # Baza podataka (Docker mreža)
  DATABASE_URL=postgresql://user:password@db:5432/database

  # JWT & Auth
  JWT_SECRET=neki-string
  NEXTAUTH_SECRET=neki-string
  NEXTAUTH_URL=http://localhost:3000

  # Docker DB Credentials
  DB_USER=user
  DB_PASSWORD=password
  DB_NAME=database

### Pokretanje putem Dockera (preporučeno)

```bash
docker compose up --build
```

Ova komanda pokreće dva servisa:
- **frontend** – Next.js aplikacija
- **backend** – API servis

Aplikacija će biti dostupna na `http://localhost:3000`.

### Lokalno pokretanje (bez Dockera)

1. Instaliraj zavisnosti:

```bash
npm install
```

2. Kreiraj `.env` fajl u root direktorijumu i popuni neophodne promenljive (pogledaj sekciju [Environment promenljive](#-environment-promenljive)).

3. Pokreni migracije i seed baze:

```bash
npm run db:migrate
npm run db:seed
```

4. Pokreni razvojni server:

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`.

---

## 🔐 Environment promenljive

Kreiraj `.env` fajl u root direktorijumu projekta sa sledećim promenljivama:

```env
# Baza podataka
DATABASE_URL=postgresql://korisnik:lozinka@host:5432/pub_kviz

# NextAuth
NEXTAUTH_SECRET=tvoj_tajni_kljuc
NEXTAUTH_URL=http://localhost:3000

# JWT
JWT_SECRET=tvoj_jwt_tajni_kljuc
```

> ⚠️ Nikada ne commit-uj `.env` fajl u sistem za kontrolu verzija.

---

## 📁 Struktura projekta

```
/
├── src/
│   ├── app/
│   │   ├── api/           # Next.js API rute (REST endpoints)
│   │   ├── profile/       # Stranica profila korisnika
│   │   ├── team/          # Stranice vezane za timove
│   │   ├── events/        # Stranice takmičenja i događaja
│   │   └── ...            # Ostale stranice aplikacije
│   ├── components/        # Višekratno upotrebljive React komponente
│   └── db/                # Drizzle ORM konfiguracija i šeme
├── docker-compose.yml
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ✨ Funkcionalnosti

### Autentifikacija
- Registracija novog korisnika
- Prijava putem NextAuth sesija
- Zaštićene rute za ulogovane korisnike

### Upravljanje timovima
- Kreiranje novog tima
- Pregled i pretraga postojećih timova
- Slanje zahteva za članstvo u timu
- Kapiten tima može prihvatiti ili odbiti zahteve za članstvo

### Takmičenja
- Pregled dostupnih takmičenja po sezonama
- Kapiten može prijaviti tim na takmičenje
- Praćenje statusa prijave

### Rang lista
- Prikaz rang liste svih timova u okviru odabranog takmičenja i sezone
- Vizualizacija podataka putem Recharts grafikona

### API dokumentacija
- Swagger UI dostupan na `/api-docs`
- Sve API rute su dokumentovane putem JSDoc anotacija

---

## 📖 Korišćenje

### Frontend i backend

Frontend i backend su integrisani unutar iste Next.js aplikacije. Pokretanjem aplikacije (Docker ili `npm run dev`) dostupni su i korisnički interfejs i API na istom portu.

### Primeri API poziva

**Registracija korisnika:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "korisnik123",
  "email": "korisnik@primer.com",
  "password": "sigurna_lozinka"
}
```

**Prijava tima na takmičenje:**
```http
POST /api/events/{eventId}/register
Authorization: Bearer <token>

{
  "teamId": 1
}
```

**Preuzimanje rang liste:**
```http
GET /api/leaderboard?eventId=1&seasonId=2
```

### Swagger dokumentacija

Nakon pokretanja aplikacije, interaktivna API dokumentacija dostupna je na:

```
http://localhost:3000/api-docs
```

---

## 🧪 Testiranje

Projekat koristi tri vrste testova:

### Unit testovi (Vitest)

```bash
npm run test
```

Za watch režim:

```bash
npm run test:watch
```

### Integracioni testovi (Jest)

Jest se koristi za testiranje API ruta putem `next-test-api-route-handler` i `supertest`.

```bash
npx jest
```

### End-to-end testovi (Playwright)

```bash
npm run test:e2e
```

> Playwright testovi zahtevaju pokrenut server. Preporučuje se pokrenuti `npm run dev` u zasebnom terminalu pre pokretanja e2e testova.

### Provera tipova

```bash
npm run typecheck
```

---

## 🌍 Deployment

### Aplikacija – Vercel

Aplikacija je postavljena na [Vercel](https://vercel.com) platformi. Svaki push na `main` granu automatski pokreće novi deployment.

Za ručno kreiranje build-a:

```bash
npm run build
```

### Baza podataka – Neon

Baza podataka je hostovana na [Neon](https://neon.tech) PostgreSQL platformi. Konekcioni string se podešava putem `DATABASE_URL` environment promenljive u Vercel kontrolnoj tabli.

### Migracije na produkciji

```bash
npm run db:migrate
```

> Pokrenuti nakon svake izmene šeme baze podataka.

---

## 📚 Dodatni resursi

- [Next.js dokumentacija](https://nextjs.org/docs)
- [Drizzle ORM dokumentacija](https://orm.drizzle.team)
- [Tailwind CSS dokumentacija](https://tailwindcss.com/docs)
- [NextAuth.js dokumentacija](https://next-auth.js.org)
- [Neon dokumentacija](https://neon.tech/docs)
- [Swagger / OpenAPI](https://swagger.io/docs/)

---

## 👤 Autor

Projekat razvijen kao deo pub kviz platforme.

---

*Licenca: Private*
