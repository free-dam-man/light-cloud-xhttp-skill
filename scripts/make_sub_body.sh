#!/usr/bin/env bash
# Usage: ./scripts/make_sub_body.sh 'vless://...'
# Prints base64 body for stream-sub SUB_BODY env (no wrapping).
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "usage: $0 'vless://...'" >&2
  exit 1
fi
printf '%s' "$1" | base64 | tr -d '\n'
echo
