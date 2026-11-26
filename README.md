# GameStore Frontend (Next.js + Clean Architecture)

Aplicación frontend construida con **Next.js (App Router + TypeScript)**, **Tailwind CSS v4** y **Redux Toolkit** siguiendo **Clean Architecture (Feature-First)**, con comunicación en tiempo real mediante **WebSockets (Socket.IO + JWT)** y soporte dual intercambiable entre **REST** y **GraphQL** en el módulo de `games`.

---

## Enlaces de Despliegue en Producción (Cloud)

- **Frontend (Vercel):** https://taller-next-gamestore-frontend.vercel.app
- **Backend API (Railway):** https://backend-production-cb879175.up.railway.app
- **Documentación Swagger (REST):** https://backend-production-cb879175.up.railway.app/api/docs
- **Endpoint GraphQL:** https://backend-production-cb879175.up.railway.app/graphql

> **Credenciales de prueba (seed):**
> - Admin: `admin@store.com` / `admin`
> - Cliente: `client@store.com` / `client`

---

## Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_DATA_SOURCE=rest # o "graphql"
```

---

## Arranque en Desarrollo

> El backend NestJS corre por defecto en el puerto **`3000`** y el frontend Next.js corre en el puerto **`3001`**.

```bash
npm install
npm run dev
```

Abrir en el navegador: `http://localhost:3001`

---

## Pruebas Automatizadas E2E (Cypress v16)

La suite en `cypress/e2e/` cubre:
- **Autenticación y JWT:** `auth.cy.ts`, `profile.cy.ts`
- **Control de acceso, roles y authorities:** `access-control.cy.ts`, `users-admin.cy.ts`, `api-users.cy.ts`
- **Catálogo, filtros, paginación y compras:** `catalog.cy.ts`, `wishlist-purchases.cy.ts`
- **Tiempo real (WebSockets + JWT):** `realtime.cy.ts`

Con el backend en `:3000` y el frontend en `:3001`:

```bash
# Modo headless (CI / terminal)
npm run cy:run

# Interfaz interactiva de Cypress
npm run cy:open

# Contra otro backend (Cypress v16 usa --expose para configuración pública)
npx cypress run --expose apiUrl=https://backend-production-cb879175.up.railway.app
```

---

## Módulo Dual: REST y GraphQL (`src/features/games`)

El módulo `games` demuestra el desacoplamiento de **Clean Architecture**:

- **Dominio (`domain/`):** Entidad `Game`, puerto único `GameRepository` y casos de uso (`GetGamesUseCase`, `GetGameByIdUseCase`, `CreateGameUseCase`, `UpdateGameUseCase`, `UpdateGameDiscountUseCase`, `DeleteGameUseCase`). No depende de REST, GraphQL, React ni Next.js.
- **Infraestructura (`infrastructure/`):**
  - Interfaz `GameDatasource` y DTOs compartidos (`GameDto`, `CreateGameDto`, `UpdateGameDto`).
  - `GameRestDatasource`: consume los endpoints REST `/games`.
  - `GameGraphQLDatasource`: consume el endpoint GraphQL `/graphql` con las queries/mutations `games`, `game`, `createGame`, `updateGame`, `updateGameDiscount` y `removeGame`.
  - `GameMapper`: convierte los DTOs de ambas fuentes hacia la entidad de dominio `Game`.
  - `GameRepositoryImpl`: selecciona el datasource activo según `NEXT_PUBLIC_DATA_SOURCE=rest|graphql`.
- **Presentación (`presentation/`):** Hook fachada `useGames` y componentes puros (`GameList`, `GameCard`, `GameCatalog`). Cambiar la variable de entorno **no modifica** dominio, casos de uso, hooks ni UI.

## Comparativo REST vs. GraphQL

| Aspecto | REST (`GameRestDatasource`) | GraphQL (`GameGraphQLDatasource`) |
| --- | --- | --- |
| **Endpoints** | Múltiples rutas (`/games`, `/games/:id`, `/games/:id/discount`) con verbos HTTP (`GET`, `POST`, `PATCH`, `DELETE`). | Único endpoint (`POST /graphql`) con operaciones declarativas (`query` / `mutation`). |
| **Selección de campos** | El servidor retorna siempre el payload completo definido por el controlador. | El cliente solicita exactamente los campos requeridos (`GAME_FIELDS`), evitando *over-fetching*. |
| **Autenticación** | `Authorization: Bearer <token>` validado por `JwtAuthGuard` y `RolesGuard`. | Mismo header `Authorization: Bearer <token>` validado en contexto GraphQL por los mismos guards. |
| **Tipado de contrato** | Documentado vía OpenAPI/Swagger (`/api/docs`). | Esquema tipado autogenerado (`autoSchemaFile: true`) en NestJS GraphQL. |
| **Impacto en Clean Architecture** | Ninguno sobre dominio o UI; ambos retornan el mismo `GameDto` hacia `GameMapper`. | Ninguno sobre dominio o UI; intercambiable mediante `NEXT_PUBLIC_DATA_SOURCE=graphql`. |
