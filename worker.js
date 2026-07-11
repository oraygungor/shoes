const ALLOWED_HOSTS = new Set(["runrepeat.com", "www.runrepeat.com"]);

export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const rawTarget = reqUrl.searchParams.get("url");
    if (!rawTarget) return response("Missing url", 400);

    let target;
    try { target = new URL(rawTarget); }
    catch { return response("Invalid url", 400); }

    if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
      return response("Only RunRepeat HTTPS links are allowed", 403);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    try {
      const upstream = await fetch(target.toString(), {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "Mozilla/5.0 (compatible; ShoeLab/1.0)"
        },
        redirect: "follow",
        signal: controller.signal
      });

      if (!upstream.ok) return response(`Upstream error ${upstream.status}`, 502);

      const length = Number(upstream.headers.get("content-length") || 0);
      if (length > 5_000_000) return response("Page too large", 413);

      const html = await upstream.text();
      if (html.length > 5_000_000) return response("Page too large", 413);

      return new Response(html, {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=1800"
        }
      });
    } catch (error) {
      return response(error.name === "AbortError" ? "Upstream timeout" : "Fetch failed", 502);
    } finally {
      clearTimeout(timer);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function response(message, status) {
  return new Response(message, { status, headers: { ...corsHeaders(), "Content-Type": "text/plain; charset=utf-8" } });
}