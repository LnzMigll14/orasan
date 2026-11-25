import { useEffect } from "react";

const SITE_NAME = "Orasan";

function setRobots(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "robots";
    document.head.append(tag);
  }
  tag.content = content;
}

/**
 * Sets the tab title and tells search engines whether to index this page. Only the public
 * landing page is indexed: app screens hold one person's private data and differ per browser.
 */
export function usePageMeta(title: string | null, { index = false }: { index?: boolean } = {}) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: time tracking and invoicing for Filipino freelancers`;
    setRobots(index ? "index, follow" : "noindex, nofollow");
  }, [title, index]);
}
