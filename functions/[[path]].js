// Cloudflare Pages SPA fallback for the mixed static + dynamic-catch-all export.
// Serve real static assets from env.ASSETS first; any unmatched route ('/...' that
// is a client-side article/category shell) falls back to index.html so the
// catch-all [...slug] page can render it on the client.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    return env.ASSETS.fetch(new Request(new URL('/', url), request));
  } catch (error) {
    return new Response('Internal Error', { status: 500 });
  }
}