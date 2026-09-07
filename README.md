# ESN Resource Manager — Frontend

> **Setting this up on a new machine? Read `backend/INSTALL.md`** — the complete
> step-by-step Windows guide covering BOTH projects (prerequisites, exact versions,
> data loading, logins, troubleshooting). This README is the developer reference.

Next.js (App Router) + TypeScript frontend for the internal ESN resource-management app:
recruitment, consultants, clients, missions and staffing, contracts and their validation
workflow, documents, job offers with a public application portal, reporting, and user
administration. Auth is Keycloak (OIDC) via NextAuth; all data comes from the backend REST API.

## Stack
- Next.js 15 (App Router), React 19, TypeScript (strict)
- Auth: `next-auth` with the Keycloak (OIDC) provider
- Talks to the backend REST API at `NEXT_PUBLIC_API_BASE_URL`

## Prerequisites
- Node.js 22 LTS (tested on 22.23.2)
- A running Keycloak with realm `esn` and a public client `esn-frontend`
- The backend API running at `http://localhost:4000/api`

## Install
```bash
npm install
```

## Configure env
Copy the example and fill in values:
```bash
cp .env.local.example .env.local
```
| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend REST base URL (`http://localhost:4000/api`) |
| `NEXTAUTH_URL` | This app's URL (`http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random 32-byte secret — `openssl rand -base64 32` |
| `KEYCLOAK_ISSUER` | `http://localhost:8080/realms/esn` |
| `KEYCLOAK_CLIENT_ID` | `esn-frontend` |
| `KEYCLOAK_CLIENT_SECRET` | Empty for a public client; set if confidential |

## Run
```bash
npm run dev        # http://localhost:3000
npm run build
npm run start
npm run lint
npm run typecheck  # tsc --noEmit
```

## Auth setup note
We use **NextAuth + Keycloak provider** (not `keycloak-js`).

- Rationale: NextAuth keeps the session in HTTP-only cookies (no token exposed to
  JS-accessible storage), integrates cleanly with the App Router Route Handlers, and lets
  the server-side typed API client read the access token. `keycloak-js` is browser-only and
  would push token storage into client JS — heavier and less secure for an internal SSR app.
- The Keycloak **access token** is carried into the NextAuth session (`jwt` + `session`
  callbacks in `src/lib/auth.ts`). The typed API client (`src/lib/api.ts`) attaches it as
  `Authorization: Bearer <token>`; the backend verifies it against Keycloak JWKS.
- The application **role** (`RH | MANAGER | DIRECTION | CONSULTANT`) is parsed from the token
  (`realm_access.roles`, falling back to `resource_access[esn-frontend].roles`) and exposed on
  the session to drive navigation/UI.

### Keycloak client configuration
In realm `esn`, create a public client `esn-frontend` with:
- Valid redirect URI: `http://localhost:3000/api/auth/callback/keycloak`
- Web origin: `http://localhost:3000`
- Map the application roles into the token (realm roles or a client role mapper).

> RBAC is enforced **server-side** by the backend on every request. UI role gating here is
> UX only — never trust the client.

## Keeping the contract in sync
`src/lib/types.ts` mirrors the backend DTOs. There is no shared workspace: when the backend
Zod schemas (`backend/src/modules/<module>/<module>.schema.ts`) change, update these types in
the same change.
