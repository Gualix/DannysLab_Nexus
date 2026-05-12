# Local Docker Setup

One-shot bootstrap to build and run Danny's Lab Nexus in local Docker containers.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
  - macOS / Windows / Linux all supported
  - Includes the `docker compose` plugin (v2). Legacy `docker-compose` also works.
- ~2 GB free disk space for images
- Ports **8080** (nginx) free on the host

## Quick Start

From the project root:

```bash
./docker-run.sh
```

That's it. The script will:

1. Verify Docker is installed and the daemon is running.
2. Auto-detect `docker compose` vs `docker-compose`.
3. Create `.env.local` from [.env.example](.env.example) if it does not exist.
4. Build the app + nginx images.
5. Start both containers detached.
6. Poll `http://localhost:8080/healthz` until the app is healthy.

When it finishes, the app is available at:

- **App (via nginx):** http://localhost:8080
- **Health check:** http://localhost:8080/healthz

## Configure environment variables

On first run the script copies [.env.example](.env.example) → `.env.local`. Before using the app for anything real, edit `.env.local` and set:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ← **must be a real value**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

After editing, restart the stack:

```bash
./docker-run.sh restart
```

> `.env.local` is git-ignored. Never commit real secrets.

## Commands

| Command | What it does |
| --- | --- |
| `./docker-run.sh` | Build (if needed) and start in the background |
| `./docker-run.sh --rebuild` | Force a clean rebuild (no Docker cache) |
| `./docker-run.sh --logs` | Start, then tail logs (Ctrl+C to exit) |
| `./docker-run.sh restart` | Recreate containers |
| `./docker-run.sh down` | Stop and remove containers |
| `./docker-run.sh --help` | Show usage |

Flags and commands can be combined, e.g.:

```bash
./docker-run.sh --rebuild --logs
```

## What gets started

Defined in [docker-compose.yml](docker-compose.yml):

- **app** — Node 22 SSR server built from [Dockerfile](Dockerfile), serving on internal port `3000`. Not published to the host directly.
- **nginx** — `nginx:1.27-alpine` reverse proxy, published on host `8080:80`, config at [nginx/nginx.conf](nginx/nginx.conf).

Both containers join the `danny-lab-network` bridge network. `nginx` waits for the `app` container's healthcheck to pass before starting.

## Useful follow-up commands

```bash
# Tail logs for just the app
docker compose logs -f app

# Open a shell in the running app container
docker compose exec app sh

# Check container status / health
docker compose ps

# Stop everything and free the port
./docker-run.sh down
```

## Troubleshooting

**“Docker daemon is not running”**
Start Docker Desktop, wait for the whale icon to stop animating, then re-run the script.

**Port 8080 already in use**
Stop whatever is using it, or edit the `ports:` mapping in [docker-compose.yml](docker-compose.yml) (e.g. `"8081:80"`).

**App never becomes healthy**
The script prints the last 80 lines of logs on timeout. Most common cause is bad / placeholder Supabase env vars in `.env.local`. Fix them and run:

```bash
./docker-run.sh restart
```

**Stale build / weird errors after pulling new code**
Force a clean rebuild:

```bash
./docker-run.sh --rebuild
```

**Reset everything**

```bash
./docker-run.sh down
docker system prune -f          # optional: remove dangling images
./docker-run.sh --rebuild
```
