import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const chapters = await getCollection("chapters");

  return rss({
    title: "I'm a Young God, Won't You Raise Me?",
    description: "New Chapter Updates",
    site: context.site,

    items: chapters
      .sort((a, b) => b.data.chapter - a.data.chapter)
      .map((chapter) => ({
        title: `Chapter ${chapter.data.chapter}`,
        pubDate: chapter.data.date,
        description: "A new chapter has been released!",
        link: `berriezai/chapters/${chapter.id}/`,
      })),
  }); 
}