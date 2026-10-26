# Light Cloud / 同类 PaaS · VLESS + XHTTP 一键复刻

> Zero-VPS style node on **Light Cloud** (and similar Node PaaS): `VLESS + XHTTP packet-up + TLS ALPN h2` → Shadowrocket / v2rayN subscription.

**English:** Deploy two tiny Node apps (`stream-node` + `stream-sub`) to Light Cloud (or any Node host that gives you HTTPS). Clients connect with **XHTTP**, not WebSocket — Cloudflare in front of Light Cloud **blocks WS**, so WS templates fail; XHTTP packet-up works.

Sibling skills (freedom / no-walls):

- [homeline-residential-exit-skill](https://github.com/free-dam-man/homeline-residential-exit-skill) — VPS Mihomo 真家宽（更稳）
- [cf-sstp-home-broadband-skill](https://github.com/free-dam-man/cf-sstp-home-broadband-skill) — CF Worker MS-SSTP 免 VPS 家宽（更飘）
- [cf-global-edge-node-skill](https://github.com/free-dam-man/cf-global-edge-node-skill) — CF 全局优选入口节点

---

## 为什么是 XHTTP / Why XHTTP

| Transport | On Light Cloud (CF edge) |
|---|---|
| VLESS + WS + TLS | Often **dead** (CF / platform WS block) |
| VLESS + **XHTTP packet-up** + TLS `alpn=h2` | **Works** (verified 2026-10-26 E2E `generate_204=204`) |

DockHosting (`*.dockhosting.dev`) was probed the same day and returned **503/502** — platform side; do not treat this skill as “DockHosting works”.

---

## 架构 / Architecture

```text
Shadowrocket / v2rayN / sing-box
   │  VLESS + XHTTP (packet-up) + TLS ALPN h2
   ▼
stream-node  (HTTPS Node app on Light Cloud / similar PaaS)
   └─ exit = PaaS region IP (e.g. GCP europe-west1)
stream-sub   (optional tiny sub host; base64 body of one VLESS URL)
   └─ subscription URL for one-tap import
```

---

## 快速复刻 / Reproduce

1. **Register** a Light Cloud (or similar) account that can deploy Node apps with public HTTPS.
2. **Copy** `deploy/stream-node` and `deploy/stream-sub`.
3. **Set env** (do **not** commit real values):

| App | Env | Example |
|---|---|---|
| stream-node | `UUID` | fresh UUIDv4 |
| stream-node | `SUB_PATH` | random path token (same as sub token) |
| stream-node | `XPATH` | e.g. `/api/v1/stream-<random>` |
| stream-sub | `SUB_TOKEN` | same as `SUB_PATH` |
| stream-sub | `SUB_BODY` | base64 of **one line** VLESS URL (see below) |

4. **Deploy** both apps; note the public hostnames.
5. **Build VLESS URL** (Shadowrocket / Xray):

```text
vless://<UUID>@<stream-node-host>:443?encryption=none&security=tls&sni=<stream-node-host>&alpn=h2%2Chttp%2F1.1&fp=chrome&allowInsecure=1&type=xhttp&host=<stream-node-host>&path=<urlencode XPATH>&mode=packet-up#LightCloud-BE
```

6. **SUB_BODY** = `echo -n '<that vless URL>' | base64 -w0` (or base64 without wrapping on macOS).
7. **Subscription** = `https://<stream-sub-host>/<SUB_TOKEN>`
8. **Verify** with Xray/sing-box socks → `generate_204` (expect HTTP 204). First connect after idle scale-to-zero may take a few seconds.

Helper: `scripts/make_sub_body.sh`

---

## 仓库内容 / Layout

```text
deploy/stream-node/   # node entry (XHTTP VLESS)
deploy/stream-sub/    # subscription server
scripts/              # helpers
SKILL.md              # agent skill brief
LICENSE               # MIT
```

Defaults in source are **placeholders** (`CHANGE_ME_*`). Rotate UUID/token per deploy. Never publish live credentials.

---

## 诚实限制 / Honest limits

- PaaS **scale-to-zero** → cold start on first dial.
- Exit IP = **datacenter / PaaS region**, not residential (`真家宽` 请用 sibling homeline / SSTP).
- Platform outages (e.g. DockHosting 503) are outside this code.
- China entry path still depends on your client / local network; this skill does not ship CF preferred-IP fronts.

---

## License

MIT — copy, fork, teach. Freedom / no-walls.
