import type { SerpResult } from "./duckduckgo";

export async function searchSerpAPI(query: string): Promise<SerpResult[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error("SERPAPI_KEY not set");

  const params = new URLSearchParams({
    q: query,
    api_key: apiKey,
    engine: "google",
    num: "10",
  });

  const response = await fetch(
    `https://serpapi.com/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`SerpAPI returned ${response.status}`);
  }

  const data = await response.json();
  const results: SerpResult[] = [];

  if (data.organic_results) {
    for (const result of data.organic_results.slice(0, 10)) {
      results.push({
        title: result.title || "",
        url: result.link || "",
        snippet: result.snippet || "",
      });
    }
  }

  return results;
}
