# BigTower

**A modern, user-friendly Docker container update monitor.**

> Fork of [WUD (What's Up Docker?)](https://github.com/getwud/wud) with a completely redesigned GUI, full settings management, and security hardening.

---

## What's Different?

This fork builds on top of WUD with **GUI improvements, CRUD settings management, and security hardening** — while keeping the powerful backend engine.

### UI & UX

- **Modern dashboard** — Stats cards with update breakdown by severity (major/minor/patch), quick actions panel
- **Improved navigation** — Expanded sidebar by default, proper breadcrumbs, human-readable page titles
- **Better container list** — Full-text search, chip-based toggle filters, result count, loading states
- **Cleaner container cards** — Status indicator dots, better visual hierarchy, improved expand/collapse
- **Refreshed design system** — New color palette, consistent card styling, smooth transitions
- **Improved login page** — Centered card layout instead of dialog
- **404 page** — Catch-all route for unknown paths
- **Better notifications** — Color-coded snackbar with icons
- **Dark mode** — Always accessible from sidebar (not hidden when collapsed)

### Settings Management

- **Full CRUD** — Add, edit, and delete watchers, registries, triggers, and authentications directly from the UI
- **Persistent configuration** — Changes made in the UI are saved to the store and survive restarts
- **Hot-reload** — Components are registered/deregistered live without restarting the container
- **Rollback on failure** — If a new configuration fails to register, the previous config is restored automatically

### Security Hardening

- **Security headers** via Helmet — X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, Referrer-Policy, and more
- **No server fingerprinting** — `X-Powered-By` header removed
- **Rate limiting** — Login and password-change endpoints are rate-limited (15 attempts per 15-minute window)
- **Session cookie hardening** — `HttpOnly`, `SameSite=Lax`, `Secure` (auto-activates behind HTTPS)
- **Authenticated API** — All data endpoints require authentication (including `/api/app`)
- **Request body size limit** — Capped at 1MB to prevent payload-based DoS
- **Input validation** — URL parameters are sanitized on all CRUD operations

## Getting Started

BigTower is a drop-in replacement for WUD. Same Docker image structure, same API.

Environment variables now use the `BT_` prefix instead of `WUD_`.
Docker labels now use `bt.*` instead of `wud.*`.

```bash
docker run -d \
  --name bigtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 3000:3000 \
  bigtower
```

### Reverse Proxy

For public-facing deployments, place BigTower behind a reverse proxy (Traefik, nginx, Caddy) with TLS termination. The `Secure` cookie flag activates automatically when served over HTTPS.

## Original Project

This is a fork of [WUD](https://github.com/getwud/wud) by fmartinou. All credit to the original author for the excellent backend engine.

## License

This project is licensed under the [MIT license](LICENSE).