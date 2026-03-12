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

### Quick Start

```bash
docker run -d \
  --name bigtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 3000:3000 \
  bigtower
```

Then open **http://localhost:3000** in your browser.

### Docker Compose

```yaml
services:
  bigtower:
    image: bigtower
    container_name: bigtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - bt-store:/store
    ports:
      - "3000:3000"
    environment:
      - BT_WATCHER_LOCAL_WATCHBYDEFAULT=true
      - BT_AUTH_BASIC_ADMIN_USER=admin
      - BT_AUTH_BASIC_ADMIN_HASH=$$apr1$$8zDVtSAY$$62WBh9DspNbUKMZXYRsjS/
    restart: unless-stopped

volumes:
  bt-store:
```

> The hash above is for password `admin`. Generate your own with `htpasswd -nbB admin yourpassword`.

---

## Configuration

All configuration is done through **environment variables** (`BT_` prefix) and **Docker labels** (`bt.*` prefix).

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BT_WATCHER_LOCAL_WATCHBYDEFAULT` | Watch all containers by default | `true` |
| `BT_WATCHER_LOCAL_WATCHALL` | Monitor stopped containers too | `false` |
| `BT_WATCHER_LOCAL_WATCHEVENTS` | React to Docker start/stop events | `true` |
| `BT_WATCHER_LOCAL_CRON` | Polling schedule (cron syntax) | `0 * * * *` (hourly) |
| `BT_AUTH_BASIC_{name}_USER` | Basic auth username | — |
| `BT_AUTH_BASIC_{name}_HASH` | Basic auth password hash (htpasswd) | — |
| `BT_SERVER_PORT` | HTTP port | `3000` |
| `BT_SERVER_TLS_ENABLED` | Enable HTTPS | `false` |
| `BT_LOG_LEVEL` | Log level (`debug`, `info`, `warn`, `error`) | `info` |

### Docker Labels (per-container)

Add labels to your containers to control how BigTower watches them:

```yaml
services:
  myapp:
    image: myapp:1.0.0
    labels:
      - bt.watch=true
      - bt.tag.include=^\d+\.\d+\.\d+$$
      - bt.tag.exclude=beta
      - bt.display.name=My App
      - bt.display.icon=mdi:application
      - bt.link.template=https://github.com/myorg/myapp/releases/tag/$${tag}
```

| Label | Description |
|---|---|
| `bt.watch` | Enable/disable watching (`true`/`false`) |
| `bt.tag.include` | Regex to include matching tags only |
| `bt.tag.exclude` | Regex to exclude matching tags |
| `bt.tag.transform` | Transform tag before comparison (e.g. `^v(.*)$` to strip `v` prefix) |
| `bt.display.name` | Custom display name in the UI |
| `bt.display.icon` | MDI icon for the container |
| `bt.link.template` | URL template for release links (`${tag}` is replaced) |
| `bt.trigger.include` | Only fire these triggers (comma-separated) |
| `bt.trigger.exclude` | Skip these triggers (comma-separated) |

### Authentication

**Basic Auth** (recommended for simple setups):

```bash
# Generate a password hash
htpasswd -nbB admin yourpassword

# Use it in your environment
BT_AUTH_BASIC_ADMIN_USER=admin
BT_AUTH_BASIC_ADMIN_HASH='$apr1$...'
```

**OpenID Connect** (for SSO with Authelia, Authentik, Keycloak, etc.):

```bash
BT_AUTH_OIDC_MYPROVIDER_CLIENTID=bigtower
BT_AUTH_OIDC_MYPROVIDER_CLIENTSECRET=your-secret
BT_AUTH_OIDC_MYPROVIDER_DISCOVERY=https://auth.example.com/.well-known/openid-configuration
```

### Registries

BigTower supports Docker Hub (public images) out of the box. For private registries:

```bash
# GitHub Container Registry
BT_REGISTRY_GHCR_PRIVATE_USERNAME=your-github-user
BT_REGISTRY_GHCR_PRIVATE_TOKEN=ghp_xxxxxxxxxxxx

# Docker Hub (private repos)
BT_REGISTRY_HUB_PRIVATE_LOGIN=your-docker-user
BT_REGISTRY_HUB_PRIVATE_TOKEN=your-access-token

# GitLab
BT_REGISTRY_GITLAB_PRIVATE_TOKEN=glpat-xxxxxxxxxxxx
```

### Triggers

Triggers fire when updates are detected. Examples:

```bash
# Email notification
BT_TRIGGER_SMTP_GMAIL_HOST=smtp.gmail.com
BT_TRIGGER_SMTP_GMAIL_PORT=465
BT_TRIGGER_SMTP_GMAIL_USER=you@gmail.com
BT_TRIGGER_SMTP_GMAIL_PASS=app-password
BT_TRIGGER_SMTP_GMAIL_TO=you@gmail.com

# Discord webhook
BT_TRIGGER_DISCORD_MYSERVER_URL=https://discord.com/api/webhooks/xxx/yyy

# MQTT (Home Assistant)
BT_TRIGGER_MQTT_HASS_URL=mqtt://192.168.1.100:1883
BT_TRIGGER_MQTT_HASS_HASS_ENABLED=true
```

### Persistent Storage

Mount `/store` to persist BigTower's database across restarts:

```bash
docker run -d \
  --name bigtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v bigtower-data:/store \
  -p 3000:3000 \
  bigtower
```

### Reverse Proxy

For public-facing deployments, place BigTower behind a reverse proxy (Traefik, nginx, Caddy) with TLS termination. The `Secure` cookie flag activates automatically when served over HTTPS.

### Prometheus & Grafana

BigTower exposes metrics at `/metrics`. A ready-made Grafana dashboard is included in `grafana/overview.json`.

```yaml
# prometheus.yml
scrape_configs:
  - job_name: bigtower
    static_configs:
      - targets: ['bigtower:3000']
```

---

## Full Documentation

See the [docs/](docs/) folder for complete configuration reference covering all watchers, registries, triggers, and authentication providers.

## Original Project

This is a fork of [WUD](https://github.com/getwud/wud) by fmartinou. All credit to the original author for the excellent backend engine.

## License

This project is licensed under the [MIT license](LICENSE).