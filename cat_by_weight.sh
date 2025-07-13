#!/usr/bin/env bash

# Usage: bat_by_weight.sh [directory] [catter_command...]
set -euo pipefail

DIR="${1:-.}"
shift  # Remove the directory argument
# Default catter command (as array)
CATTER=("bat" "--line-range=1:10" "--")
if (( $# > 0 )); then
    CATTER=("$@")  # Use provided command
fi

# Arrays to hold files
declare -a files_with_weight=()
declare -a files_without_weight=()

# Scan all regular files in DIR
shopt -s nullglob
for f in "$DIR"/*; do
  [[ -f "$f" ]] || continue
  line3=$(sed -n '3p' -- "$f")
  if [[ "$line3" =~ ^weight:\ ([0-9]+)$ ]]; then
    files_with_weight+=("${BASH_REMATCH[1]}:::$f")  # Store weight and filename together
  else
    files_without_weight+=("$f")
  fi
done

# Sort files by weight
declare -a sorted_entries=()
if (( ${#files_with_weight[@]} > 0 )); then
  # Sort numerically by weight
  mapfile -t sorted_entries < <(printf "%s\n" "${files_with_weight[@]}" | sort -n -t':' -k1)
fi

# Show files order
echo "| weight | file |"
echo "| ------ | ---- |"
for entry in "${sorted_entries[@]}"; do
  # Split on ::: and preserve everything after as filename
  weight="${entry%%:::*}"
  f="${entry#*:::}"
  printf "| %6d | %s |\n" "$weight" "$f"
done
echo

# Cat heads of files with weight
for entry in "${sorted_entries[@]}"; do
  # Split on ::: and preserve everything after as filename
  weight="${entry%%:::*}"
  f="${entry#*:::}"
  echo -e "\n--- $f (weight: $weight) ---"
  "${CATTER[@]}" "$f"
done

# Cat heads of files without weight
for f in "${files_without_weight[@]}"; do
  echo -e "\n--- $f (no weight) ---"
  "${CATTER[@]}" "$f"
done
