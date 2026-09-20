#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

log_file="$(mktemp -t gmc-update.XXXXXX)"
latest_sermon_path="public/data/latest-sermon.json"
latest_sermon_backup=""

cleanup() {
  if [[ -n "$latest_sermon_backup" && -f "$latest_sermon_backup" ]]; then
    cp "$latest_sermon_backup" "$latest_sermon_path"
  fi
  rm -f "$log_file"
  if [[ -n "$latest_sermon_backup" ]]; then rm -f "$latest_sermon_backup"; fi
}
trap cleanup EXIT

run_quietly() {
  local label="$1"
  shift

  echo "$label"
  if ! "$@" >"$log_file" 2>&1; then
    echo "Chyba: $label"
    tail -n 80 "$log_file"
    exit 1
  fi
}

restore_latest_sermon() {
  if [[ -n "$latest_sermon_backup" ]]; then
    cp "$latest_sermon_backup" "$latest_sermon_path"
  fi
}

if [[ "$#" -ne 0 ]]; then
  echo "Tento skript nepotrebuje žiadny parameter. Stačí spustiť: ./update-site.sh"
  exit 1
fi

if ! git diff --cached --quiet; then
  echo "Chyba: pred spustením dokončite alebo zrušte už staged Git zmeny. Skript ich nebude miešať do nového commitu."
  exit 1
fi

branch="$(git branch --show-current)"
upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
if [[ -z "$branch" || -z "$upstream" || "$upstream" != */* ]]; then
  echo "Chyba: nepodarilo sa zistiť Git vetvu alebo jej vzdialený cieľ. Nič nebolo zmenené."
  exit 1
fi

remote="${upstream%%/*}"
remote_branch="${upstream#*/}"

echo "GMC Sereď – aktualizácia webu"
echo "--------------------------------"

node scripts/upload-sunday-gallery.mjs
run_quietly "Generujem obsah webu…" npm run content:generate
run_quietly "Kontrolujem obsah…" npm run content:check
run_quietly "Kontrolujem TypeScript…" npm run typecheck

if [[ -f "$latest_sermon_path" ]]; then
  latest_sermon_backup="$(mktemp -t gmc-latest-sermon.XXXXXX)"
  cp "$latest_sermon_path" "$latest_sermon_backup"
fi

run_quietly "Vytváram produkčný build…" npm run build
restore_latest_sermon
echo "Produkčný build: OK"

echo "Pripravujem bezpečný Git commit…"
git add -- \
  .env.example \
  .gitignore \
  README.md \
  package-lock.json \
  package.json \
  content/program \
  content/special-events \
  content/sunday-galleries/.gitkeep \
  public/content/invitations \
  public/content/program \
  public/content/sundays \
  scripts \
  src \
  update-site.sh

if git diff --cached --quiet; then
  echo "Nie sú žiadne zmeny na commit. Web je aktuálny."
  exit 0
fi

git commit -m "content: update GMC website"
git push "$remote" "HEAD:$remote_branch"

echo "Commit vytvorený. Push: OK"
echo "GitHub Pages teraz automaticky nasadí web z vetvy $branch."
