#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

sunday_date="${1:-}"

echo "GMC Sereď website update"
echo "------------------------"

if [[ -n "$sunday_date" ]]; then
  echo "Processing Sunday photo import: $sunday_date"
  npm run sunday:upload -- "$sunday_date"
else
  echo "Checking for Sunday photo imports..."
  npm run sunday:upload
fi

echo "Generating website content..."
npm run content:generate

echo "Validating content..."
npm run content:check

echo "Type-checking..."
npm run typecheck

echo "Building production website..."
npm run build

if git diff --quiet && git diff --cached --quiet; then
  echo "No website changes to commit."
  exit 0
fi

echo "Preparing Git commit..."
git add \
  .env.example \
  .gitignore \
  README.md \
  package-lock.json \
  package.json \
  public/content/program/current-program.jpg \
  public/content/program/program.txt \
  public/content/sundays \
  scripts \
  src \
  update-site.sh

if git diff --cached --quiet; then
  echo "No tracked website changes to commit."
  exit 0
fi

commit_message="Update GMC website content"
if [[ -n "$sunday_date" ]]; then
  commit_message="Update Sunday gallery ${sunday_date}"
fi

git commit -m "$commit_message"
git push origin main

echo "Done. GitHub Pages will deploy automatically from main."
