const spec = {
  openapi: "3.0.3",
  info: {
    title: "Kalao CRM",
    version: "1",
    description: "Clients, prospects, dossiers et factures. Les clés se créent côté direction. La signature électronique n'est pas exposée.",
  },
  paths: {
    "/api/v1/health": {
      get: { summary: "Disponibilité", responses: { "200": { description: "ok" } } },
    },
  },
};

export function GET() {
  return Response.json(spec);
}
