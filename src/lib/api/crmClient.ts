import { getLocalSession } from "@/lib/auth/session";

function actorHeaders(extra?: Record<string, string>): Record<string, string> {
  const session = getLocalSession();
  const headers = { ...extra };
  if (session?.fullName) {
    headers["x-crm-actor"] = session.fullName;
  } else if (session?.email) {
    headers["x-crm-actor"] = session.email;
  }
  return headers;
}

export async function createCrmRecord(resource: string, payload: Record<string, unknown>) {
  const response = await fetch(`/api/v1/${resource}`, {
    method: "POST",
    headers: actorHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Création ${resource} impossible`);
  }
  return response.json();
}

export async function updateCrmRecord(resource: string, id: string, payload: Record<string, unknown>) {
  const response = await fetch(`/api/v1/${resource}/${id}`, {
    method: "PATCH",
    headers: actorHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Mise à jour ${resource} impossible`);
  }
  return response.json();
}

export async function deleteCrmRecord(resource: string, id: string) {
  const response = await fetch(`/api/v1/${resource}/${id}`, {
    method: "DELETE",
    headers: actorHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Suppression ${resource} impossible`);
  }
  return response.json();
}

export async function fetchCrmRecord<T>(resource: string, id: string): Promise<T> {
  const response = await fetch(`/api/v1/${resource}/${id}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Fiche ${resource} introuvable`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
}

export async function uploadCrmFile(file: File, parentType = "files", parentId = "root") {
  const body = new FormData();
  body.append("file", file);
  body.append("parentType", parentType);
  body.append("parentId", parentId);
  const response = await fetch("/api/v1/files", { method: "POST", body, headers: actorHeaders() });
  if (!response.ok) {
    throw new Error("Upload impossible");
  }
  return response.json();
}

export async function fetchCrmFiles(parentType?: string, parentId?: string) {
  const params = new URLSearchParams();
  if (parentType) params.set("parentType", parentType);
  if (parentId) params.set("parentId", parentId);
  const response = await fetch(`/api/v1/files?${params.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Liste fichiers impossible");
  }
  const json = (await response.json()) as { data: Array<Record<string, unknown>> };
  return json.data ?? [];
}
