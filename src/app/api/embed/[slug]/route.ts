import { NextRequest } from "next/server";
import { captureFormUrl } from "@/lib/org";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = raw.replace(/\.js$/, "");
  const formUrl = captureFormUrl(slug);

  const script = `
(function () {
  var s = document.currentScript;
  var iframe = document.createElement("iframe");
  iframe.src = ${JSON.stringify(formUrl)};
  iframe.style.width = "100%";
  iframe.style.border = "0";
  iframe.style.minHeight = "640px";
  iframe.loading = "lazy";
  iframe.title = "Formulaire Kalao";
  s.parentNode.insertBefore(iframe, s.nextSibling);
})();
`.trim();

  return new Response(script, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
