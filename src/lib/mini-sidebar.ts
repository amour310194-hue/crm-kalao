const MINI_CLASS = "mini-sidebar";

function targets(): Element[] {
  if (typeof document === "undefined") return [];
  return [document.documentElement, document.body, document.querySelector(".main-wrapper")].filter(
    (el): el is Element => Boolean(el)
  );
}

export function isMiniSidebarActive(): boolean {
  return targets().some((el) => el.classList.contains(MINI_CLASS));
}

export function applyMiniSidebar(mini: boolean) {
  targets().forEach((el) => el.classList.toggle(MINI_CLASS, mini));
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-layout", mini ? "mini" : "default");
  }
}

/** Bascule tout de suite le DOM, sans attendre Redux. */
export function toggleMiniSidebarDom(): boolean {
  const next = !isMiniSidebarActive();
  applyMiniSidebar(next);
  return next;
}
