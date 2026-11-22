# GameStore Frontend (Next.js + Clean Architecture)

Aplicación frontend construida con **Next.js (App Router + TypeScript)** siguiendo **Clean Architecture (Feature-First)**, con soporte dual intercambiable entre **REST** y **GraphQL** en el módulo de `games`.

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_DATA_SOURCE=rest # o "graphql"
```

## Arranque en desarrollo

```bash
npm install
npm run dev
```

## Módulo Dual: REST y GraphQL (`src/features/games`)

El módulo `games` demuestra el desacoplamiento de **Clean Architecture**:

- **Dominio (`domain/`):** Entidad `Game`, puerto único `GameRepository` y casos de uso (`GetGamesUseCase`, `GetGameByIdUseCase`, `CreateGameUseCase`, `UpdateGameUseCase`, `UpdateGameDiscountUseCase`, `DeleteGameUseCase`). No depende de REST, GraphQL, React ni Next.js.
- **Infraestructura (`infrastructure/`):**
  - Interfaz `GameDatasource` y DTOs compartidos (`GameDto`, `CreateGameDto`, `UpdateGameDto`).
  - `GameRestDatasource`: consume los endpoints REST `/games`.
  - `GameGraphQLDatasource`: consume el endpoint GraphQL `/graphql` con las queries/mutations `games`, `game`, `createGame`, `updateGame`, `updateGameDiscount` y `removeGame`.
  - `GameMapper`: convierte los DTOs de ambas fuentes hacia la entidad de dominio `Game`.
  - `GameRepositoryImpl`: selecciona el datasource activo según `NEXT_PUBLIC_DATA_SOURCE=rest|graphql`.
- **Presentación (`presentation/`):** Hook fachada `useGames` y componentes puros (`GameList`, `GameCard`). Cambiar la variable de entorno **no modifica** dominio, casos de uso, hooks ni UI.

## Comparativo REST vs. GraphQL

| Aspecto | REST (`GameRestDatasource`) | GraphQL (`GameGraphQLDatasource`) |
| --- | --- | --- |
| **Endpoints** | Múltiples rutas (`/games`, `/games/:id`, `/games/:id/discount`) con verbos HTTP (`GET`, `POST`, `PATCH`, `DELETE`). | Único endpoint (`POST /graphql`) con operaciones declarativas (`query` / `mutation`). |
| **Selección de campos** | El servidor retorna siempre el payload completo definido por el controlador. | El cliente solicita exactamente los campos requeridos (`GAME_FIELDS`), evitando *over-fetching*. |
| **Autenticación** | `Authorization: Bearer <token>` validado por `JwtAuthGuard` y `RolesGuard`. | Mismo header `Authorization: Bearer <token>` validado en contexto GraphQL por los mismos guards. |
| **Tipado de contrato** | Documentado vía OpenAPI/Swagger (`/api/docs`). | Esquema tipado autogenerado (`autoSchemaFile: true`) en NestJS GraphQL. |
| **Impacto en Clean Architecture** | Ninguno sobre dominio o UI; ambos retornan el mismo `GameDto` hacia `GameMapper`. | Ninguno sobre dominio o UI; intercambiable mediante `NEXT_PUBLIC_DATA_SOURCE=graphql`. |
