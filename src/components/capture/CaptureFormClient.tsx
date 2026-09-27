"use client";

import { useSearchParams } from "next/navigation";
import type { CaptureField } from "@/lib/capture-submit";
import { CaptureFormCard } from "./CaptureFormCard";

interface Props {
  slug: string;
  title: string;
  description: string | null;
  fields: CaptureField[];
  successMessage: string | null;
}

export default function CaptureFormClient({ slug, title, description, fields, successMessage }: Props) {
  const searchParams = useSearchParams();

  const onLiveSubmit = async (values: Record<string, string>) => {
    const res = await fetch(`/api/capture/${slug}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...values,
        utm_source: searchParams.get("utm_source") ?? "",
        utm_medium: searchParams.get("utm_medium") ?? "",
        utm_campaign: searchParams.get("utm_campaign") ?? "",
        utm_content: searchParams.get("utm_content") ?? "",
      }),
    });
    const data = (await res.json()) as { ok: boolean };
    return Boolean(data.ok);
  };

  return (
    <CaptureFormCard
      title={title}
      description={description}
      fields={fields}
      successMessage={successMessage}
      onLiveSubmit={onLiveSubmit}
    />
  );
}
