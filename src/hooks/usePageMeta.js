import { useEffect } from "react";

// Sets the browser tab title and the <meta name="description"> tag for
// whichever page calls this. This doesn't help link previews (WhatsApp,
// Facebook, etc. read the raw HTML without running JavaScript, so they
// always see index.html's tags) but it does help two real things:
// the browser tab itself, and Google's crawler, which does run
// JavaScript and reads whatever the page ends up rendering.
// noIndex is for pages that shouldn't show up in Google at all - the
// cart, checkout, and admin pages are either empty/user-specific or
// private, not something a search result should ever point to.
export function usePageMeta(title, description, { noIndex = false } = {}) {
  useEffect(() => {
    document.title = title;

    if (description) {
      let descriptionTag = document.querySelector('meta[name="description"]');
      if (!descriptionTag) {
        descriptionTag = document.createElement("meta");
        descriptionTag.setAttribute("name", "description");
        document.head.appendChild(descriptionTag);
      }
      descriptionTag.setAttribute("content", description);
    }

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!robotsTag) {
        robotsTag = document.createElement("meta");
        robotsTag.setAttribute("name", "robots");
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute("content", "noindex");
    } else if (robotsTag) {
      robotsTag.remove();
    }
  }, [title, description, noIndex]);
}
