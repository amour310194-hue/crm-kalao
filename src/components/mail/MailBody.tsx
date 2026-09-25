"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { textToHtml } from "@/lib/mail/html";
import { mailFrameDocument, sanitizeMailHtml } from "@/lib/mail/sanitize";

/**
 * Corps d'un mail dans un cadre isolé (sandbox sans scripts ni accès à la page) :
 * le HTML d'un expéditeur ne peut ni lire la session ni modifier le CRM.
 */
export default function MailBody({
  html,
  text,
  inlineUrls,
  trustedSender,
}: {
  html: string | null;
  text: string;
  inlineUrls?: Record<string, string>;
  trustedSender?: boolean;
}) {
  const [showImages, setShowImages] = useState(Boolean(trustedSender));
  const [height, setHeight] = useState(60);
  const ref = useRef<HTMLIFrameElement>(null);
  const dark = typeof document !== "undefined" && document.documentElement.getAttribute("data-bs-theme") === "dark";

  const { doc, blocked } = useMemo(() => {
    const source = html?.trim() ? html : textToHtml(text || "");
    const clean = sanitizeMailHtml(source, { showImages, inlineUrls });
    return { doc: mailFrameDocument(clean.html, dark), blocked: clean.blockedImages };
  }, [html, text, showImages, inlineUrls, dark]);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | null = null;
    const measure = () => {
      const body = frame.contentDocument?.body;
      if (body) setHeight(Math.min(Math.max(body.scrollHeight + 8, 40), 20000));
    };
    const onLoad = () => {
      measure();
      const body = frame.contentDocument?.body;
      if (body && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(measure);
        observer.observe(body);
      }
      frame.contentDocument?.querySelectorAll("img").forEach((img) => img.addEventListener("load", measure));
    };
    frame.addEventListener("load", onLoad);
    // srcdoc peut être déjà chargé avant l'abonnement : on mesure aussi tout de suite et un peu après.
    if (frame.contentDocument?.readyState === "complete") onLoad();
    const late = window.setTimeout(measure, 300);
    return () => {
      frame.removeEventListener("load", onLoad);
      window.clearTimeout(late);
      observer?.disconnect();
    };
  }, [doc]);

  return (
    <>
      {blocked > 0 && !showImages ? (
        <div className="km-images-bar">
          <i className="ti ti-photo-off me-1" />
          Les images distantes sont masquées pour protéger votre vie privée.{" "}
          <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => setShowImages(true)}>
            Afficher les images
          </button>
        </div>
      ) : null}
      {/* allow-same-origin sans allow-scripts : on peut mesurer la hauteur, le contenu ne peut rien exécuter. */}
      <iframe
        ref={ref}
        title="Contenu du message"
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        srcDoc={doc}
        scrolling="no"
        style={{ height, overflow: "hidden" }}
      />
    </>
  );
}
