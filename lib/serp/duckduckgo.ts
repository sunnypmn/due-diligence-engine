export interface SerpResult {
  title: string;
  url: string;
  snippet: string;
}

export async function searchDuckDuckGo(query: string): Promise<SerpResult[]> {
  const params = new URLSearchParams({ q: query, kl: "us-en" });

  const response = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo returned ${response.status}`);
  }

  const html = await response.text();
  const results: SerpResult[] = [];

  // Parse result blocks
  const resultBlockRegex =
    /<div class="result__body"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/;
  const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/;

  // Alternative: parse individual elements
  const linkRegex =
    /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
  const snippetRegexAlt =
    /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

  const links: { url: string; title: string }[] = [];
  const snippets: string[] = [];

  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null && links.length < 10) {
    const url = linkMatch[1];
    const title = linkMatch[2].replace(/<[^>]*>/g, "").trim();
    if (url && title && !url.startsWith("//duckduckgo")) {
      links.push({ url, title });
    }
  }

  let snippetMatch;
  while (
    (snippetMatch = snippetRegexAlt.exec(html)) !== null &&
    snippets.length < 10
  ) {
    const snippet = snippetMatch[1].replace(/<[^>]*>/g, "").trim();
    if (snippet) snippets.push(snippet);
  }

  for (let i = 0; i < Math.min(links.length, 10); i++) {
    results.push({
      title: links[i].title,
      url: links[i].url,
      snippet: snippets[i] || "",
    });
  }

  return results;
}
