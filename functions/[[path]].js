// Cloudflare Pages SPA fallback for the mixed static + dynamic-catch-all export.
// Serve real static assets from env.ASSETS first; any unmatched route falls
// back to the catch-all article shell so the [...slug] page can render it on
// the client.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    // Static export generates files as e.g. /news/some-article.html. For an
    // extensionless request /news/some-article, first try the matching .html
    // file so pre-rendered article/category pages are served directly
    // (better for users + SEO), then fall back to the SPA shells.
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) {
      const htmlUrl = new URL(`${url.pathname}.html`, url);
      const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl, request));
      if (htmlResponse.status === 200) {
        return htmlResponse;
      }
    }

    // Decide the best shell for the missing route:
    //  - Paths that look like article/category/tag URLs go to the catch-all
    //    article shell (/article-shell.html) so the client renders the right
    //    page (this was the bug: falling back to index.html just showed the
    //    homepage for every article URL).
    //  - Everything else keeps the regular SPA fallback to index.html.
    const lowerPath = url.pathname.toLowerCase();
    const isShellRoute =
      lowerPath !== '/' &&
      !lowerPath.startsWith('/_next/') &&
      !lowerPath.startsWith('/uploads/') &&
      /^\/[a-z0-9][a-z0-9\-/]*\/?$/.test(lowerPath);

    const fallbackUrl = isShellRoute ? '/article-shell.html' : '/';

    return env.ASSETS.fetch(new Request(new URL(fallbackUrl, url), request));
  } catch (error) {
    return new Response('Internal Error', { status: 500 });
  }
}