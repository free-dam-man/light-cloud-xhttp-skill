# light-cloud-xhttp-skill

## When to use
Someone wants a **reproducible** Light Cloud (or similar Node PaaS) Shadowrocket/v2rayN node using **VLESS + XHTTP packet-up + TLS ALPN h2**, not WebSocket — because CF in front of Light Cloud blocks WS.

## Do
1. Copy `deploy/stream-node` + `deploy/stream-sub`.
2. Generate fresh `UUID`, `SUB_TOKEN`/`SUB_PATH`, `XPATH`.
3. Deploy both apps; build VLESS URL with `type=xhttp&mode=packet-up&alpn=h2,http/1.1`.
4. Set `SUB_BODY` to base64 of that one-line VLESS URL; sub URL = `https://<sub-host>/<SUB_TOKEN>`.
5. E2E verify `generate_204=204`. Scrub secrets before any public commit.

## Don't
- Don't use WS templates on Light Cloud.
- Don't commit live UUID/token/sub URLs.
- Don't claim DockHosting works while platform returns 503/502.
- Don't call PaaS exit IP "真家宽".
