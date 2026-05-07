interface Env {
  ASSETS: Fetcher;
  LOGS_KV: KVNamespace;
  OGX_CORE_KV: KVNamespace;
}

const DOMAIN_MAP: Record<string, string> = {
  "www.ogxglobalhorizon.com": "https://www.ogxglobalhorizon.com",
  "ogxacademy.com": "https://ogxacademy.com",
  "ogxshop.com": "https://ogxshop.com",
  "ogxmedia.com": "https://ogxmedia.com",
  "ogxlabs.com": "https://ogxlabs.com",
  "ogxcommunity.com": "https://ogxcommunity.com",
  "ogxprime.com": "https://ogxprime.com"
};

const STATIC_FILES = new Set(["/", "/index.html", "/style.css", "/main.js", "/manifest.json", "/sw.js"]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/health")) {
      return new Response(JSON.stringify({ status: "ok", service: "ogxglobalhorizon" }), {
        headers: { "content-type": "application/json" }
      });
    }

    if (STATIC_FILES.has(url.pathname)) {
      const assetRequest = new Request(new URL(url.pathname === "/" ? "/index.html" : url.pathname, request.url), request);
      return env.ASSETS.fetch(assetRequest);
    }

    const targetOrigin = DOMAIN_MAP[url.hostname];
    if (!targetOrigin) {
      return new Response("Unknown OGX domain.", { status: 404 });
    }

    const upstreamUrl = new URL(url.pathname + url.search, targetOrigin);
    const response = await fetch(new Request(upstreamUrl.toString(), request));

    const logKey = `${Date.now()}:${crypto.randomUUID()}`;
    await env.LOGS_KV.put(
      logKey,
      JSON.stringify({ host: url.hostname, path: url.pathname, status: response.status }),
      { expirationTtl: 60 * 60 * 24 * 7 }
    );

    return response;
  }
} satisfies ExportedHandler<Env>;
