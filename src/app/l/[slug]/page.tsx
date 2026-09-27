import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase/admin";
import CaptureFormClient from "@/components/capture/CaptureFormClient";
import type { CaptureField } from "@/lib/capture-submit";

export default async function CaptureFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getServiceSupabase();
  const { data: form } = await supabase
    .from("capture_forms")
    .select("id, slug, title, description, fields, success_message")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!form) notFound();

  return (
    <Suspense>
      <CaptureFormClient
        slug={form.slug}
        title={form.title}
        description={form.description}
        fields={(form.fields ?? []) as CaptureField[]}
        successMessage={form.success_message}
      />
    </Suspense>
  );
}
