export type { SerpResult } from "./duckduckgo";
import { searchDuckDuckGo } from "./duckduckgo";
import { searchSerpAPI } from "./serpapi";
import type { SerpResult } from "./duckduckgo";

export async function search(query: string): Promise<SerpResult[]> {
  if (process.env.SERPAPI_KEY) {
    try {
      return await searchSerpAPI(query);
    } catch (err) {
      console.warn("SerpAPI failed, falling back to DuckDuckGo:", err);
    }
  }
  return searchDuckDuckGo(query);
}
