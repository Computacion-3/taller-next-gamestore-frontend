# GameStore Frontend (Next.js + Clean Architecture)

Tienda digital de videojuegos construida con **Next.js 16 (App Router + TypeScript)**, **Tailwind CSS v4** y **Redux Toolkit**, organizada con **Clean Architecture (Feature-First)**. Consume el backend NestJS por **REST** y **GraphQL** (intercambiables por configuración) y recibe eventos en **tiempo real por WebSockets (Socket.IO + JWT)**.

---

## Enlaces de despliegue (producción)

| Servicio | URL |
| --- | --- |
| **Frontend (Vercel)** | https://taller-next-gamestore-frontend.vercel.app |
| **Backend API (Railway)** | https://backend-production-cb879175.up.railway.app |
| **Swagger (REST)** | https://backend-production-cb879175.up.railway.app/api/docs |
| **GraphQL** | https://backend-production-cb879175.up.railway.app/graphql |
| **Repositorio backend** | https://github.com/Computacion-3/taller-nest-gamestore-backend |

**Credenciales de prueba (seed):**

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@store.com` | `admin` |
| Cliente | `client@store.com` | `client` |

---

## Stack

| Área | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript estricto |
| Estilos | Tailwind CSS v4 |
| Estado global | Redux Toolkit + React Redux |
| Tiempo real | Socket.IO client |
| Pruebas E2E | Cypress 16 |
| Despliegue | Vercel |

---

## Funcionalidades

**Cliente**
- Registro, inicio y cierre de sesión con JWT. La sesión se verifica con el backend al abrir la app.
- Catálogo con **paginación del servidor**, **búsqueda reactiva** (con debounce) y **filtro por categoría**, todo reflejado en la URL.
- Detalle del juego con sus categorías, precio con descuento y acciones.
- **Compra** con confirmación (saldo actual y saldo resultante) y actualización del saldo.
- **Biblioteca**, **historial de compras** y detalle de cada compra.
- **Wishlist** con precio objetivo y **alertas de precio en tiempo real**.
- **Perfil:** cambio de correo y contraseña.

**Administrador** (además de lo anterior)
- **Juegos:** crear, editar, aplicar descuentos (con vista previa del precio final) y retirar (soft delete).
- **Categorías:** crear, editar, eliminar y asignarlas a los juegos.
- **Usuarios:** listado con roles y permisos, cambio de rol y consulta de la biblioteca de cada usuario.
- **Compras:** historial global con ingresos y compradores.

---

## Arquitectura (Clean Architecture, Feature-First)

```
src/
├── app/                      # Rutas del App Router (solo componen la página)
│   └── (showcase)/           # Grupo de rutas con el fondo de video
├── features/
│   ├── auth/  games/  categories/  purchases/  library/
│   ├── wishlist/  users/  realtime/
│   │   ├── domain/           # Entidades, puertos (interfaces) y casos de uso
│   │   ├── infrastructure/   # dtos/, datasources/, mappers/, repositories/
│   │   ├── presentation/     # components/, hooks/ (fachadas), store/ (slices)
│   │   └── di/               # Contenedor: conecta implementaciones con casos de uso
├── shared/                   # Cliente HTTP, socket, store, UI reutilizable
└── proxy.ts                  # Guard de rutas (Next.js 16)
```

**Flujo de una petición:**

```
Componente → Hook fachada → Caso de uso → Repositorio (puerto) → Datasource → API
                  ↑                                                  │
               Redux  ←──────────────  Mapper (DTO → Entidad)  ←─────┘
```

- **Dominio:** entidades con validación de invariantes (por ejemplo, `Game.priceWithDiscount()`), puertos y casos de uso. No depende de React, Next.js ni HTTP.
- **Infraestructura:** DTOs de red, datasources (REST, GraphQL y Socket.IO), mappers bidireccionales y repositorios que implementan los puertos.
- **Presentación:** componentes visuales puros (reciben props), contenedores que usan **hooks fachada**, y slices de Redux. Los componentes nunca usan `fetch` ni acceden al store directamente.

---

## Estado global (Redux Toolkit)

Un slice por feature (`auth`, `games`, `categories`, `wishlist`, `library`, `purchases`, `users`, `realtime`, `ui`). Redux guarda **records serializables** (fechas como texto) y los hooks los convierten en entidades de dominio. Al cerrar sesión, todo el store vuelve a su estado inicial.

---

## Autenticación y autorización

- El JWT se guarda en `localStorage` (para las peticiones) y en una cookie (para que `proxy.ts` pueda leerla). Se envía como `Authorization: Bearer <token>` en REST, GraphQL y el handshake del WebSocket.
- **Authorities:** cada rol tiene permisos granulares (`games:create`, `games:discount`, `categories:manage`, `users:manage`, `purchases:view_all`, etc.).
- **Tres capas de protección:**
  1. `proxy.ts`: redirige a `/login` las rutas privadas sin sesión y a `/forbidden` las que exigen una authority que el rol no tiene.
  2. `RequireAuth` y `Can`: protegen vistas y acciones en el cliente.
  3. Backend: `JwtAuthGuard` + `RolesGuard` (la seguridad real).

---

## Tiempo real (WebSockets)

- `SocketIoDatasource` implementa el contrato `SocketDatasource` (`shared/infrastructure/datasources`).
- **Handshake con JWT:** el token viaja en `auth.token`; el backend rechaza la conexión si es inválido o fue revocado.
- **Eventos:**
  - `game:discount-updated` (a todos): la tarjeta, el detalle y la tabla del admin se actualizan sin recargar.
  - `wishlist:price-alert` (solo al usuario afectado): aparece en el banner de alertas y como toast.
- Los eventos se despachan a Redux (`replaceGame`, `upsertPriceAlert`). El estado de la conexión se ve en el Header ("En vivo").

---

## Módulo dual: REST y GraphQL (`src/features/games`)

- **Dominio:** un único puerto `GameRepository` y los casos de uso (`GetGamesUseCase`, `GetGameByIdUseCase`, `CreateGameUseCase`, `UpdateGameUseCase`, `UpdateGameDiscountUseCase`, `DeleteGameUseCase`).
- **Infraestructura:**
  - `GameRestDatasource`: `GET/POST/PATCH/DELETE /games`.
  - `GameGraphQLDatasource`: queries `games` y `game`; mutations `createGame`, `updateGame`, `updateGameDiscount` y `removeGame`.
  - Las dos fuentes devuelven el mismo DTO (incluido el paginado `{ items, total, page, limit, totalPages }`) hacia `GameMapper`.
  - `GameRepositoryImpl` elige la fuente según `NEXT_PUBLIC_DATA_SOURCE=rest|graphql`.
- **Transparencia:** cambiar la variable no modifica casos de uso, entidades, slices ni componentes. El catálogo, el detalle y el panel de administración funcionan igual con las dos fuentes.

### Comparativo REST vs. GraphQL

| Aspecto | REST (`GameRestDatasource`) | GraphQL (`GameGraphQLDatasource`) |
| --- | --- | --- |
| **Endpoints** | Varias rutas (`/games`, `/games/:id`, `/games/:id/discount`) con verbos HTTP. | Un único endpoint (`POST /graphql`) con `query` y `mutation`. |
| **Filtros y paginación** | Query params: `?search=&categoryId=&page=&limit=`. | Argumentos: `games(search:, categoryId:, page:, limit:)`. Misma lógica en el backend (`GamesService`). |
| **Selección de campos** | El servidor devuelve siempre el payload completo. | El cliente pide solo los campos que necesita (`GAME_FIELDS`), evitando *over-fetching*. |
| **Errores** | Código HTTP + mensaje (`RestHttpClient` los muestra). | HTTP 200 con un arreglo `errors` (el datasource los convierte en excepciones). |
| **Autenticación** | `Authorization: Bearer <token>` con `JwtAuthGuard` y `RolesGuard`. | El mismo header, validado por los mismos guards en el contexto GraphQL. |
| **Contrato** | OpenAPI/Swagger (`/api/docs`). | Esquema tipado autogenerado (`autoSchemaFile`). |
| **Impacto en la arquitectura** | Ninguno sobre dominio o UI. | Ninguno sobre dominio o UI; se activa con `NEXT_PUBLIC_DATA_SOURCE=graphql`. |

---

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL del backend (REST, GraphQL y WebSocket) | `http://localhost:3000` |
| `NEXT_PUBLIC_DATA_SOURCE` | Fuente del módulo de juegos: `rest` o `graphql` | `rest` |

> Las variables `NEXT_PUBLIC_*` se incrustan al compilar: después de cambiarlas hay que reiniciar `npm run dev` o volver a desplegar.

---

## Arranque en desarrollo

Requisitos: Node.js 22 o superior y el [backend](https://github.com/Computacion-3/taller-nest-gamestore-backend) corriendo en el puerto **3000** (con `POST /seed` ejecutado).

```bash
npm ci
npm run dev
```

Abrir `http://localhost:3001`.

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 3001 |
| `npm run build` / `npm run start` | Build de producción y servidor en el puerto 3001 |
| `npm run lint` | ESLint |
| `npm run cy:run` / `npm run cy:open` | Pruebas E2E (headless / interfaz) |

---

## Pruebas E2E (Cypress 16)

| Suite | Cubre |
| --- | --- |
| `auth.cy.ts`, `profile.cy.ts` | Registro, login, logout, perfil y tokens manipulados |
| `access-control.cy.ts`, `users-admin.cy.ts`, `api-users.cy.ts` | Rutas protegidas, 403, roles y authorities |
| `catalog.cy.ts` | Búsqueda reactiva, filtro por categoría, paginación y detalle |
| `wishlist-purchases.cy.ts` | Wishlist con precio objetivo, compra, biblioteca e historial |
| `realtime.cy.ts` | Handshake JWT, descuento en vivo y alerta de precio sin recargar |

Con el backend en `:3000` y el frontend en `:3001`:

```bash
npm run cy:run     # headless
npm run cy:open    # interfaz interactiva
```

Contra otro backend (Cypress 16 usa `--expose` para la configuración pública):

```bash
npx cypress run --expose apiUrl=https://mi-backend.com --config baseUrl=https://mi-frontend.com
```

> Las suites ejecutan `POST /seed` al iniciar. Se recomienda correrlas contra un entorno local, no contra producción.