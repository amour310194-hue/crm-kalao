import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAnonSupabase } from "@/lib/supabase/admin";
import CaptureFormClient from "@/components/capture/CaptureFormClient";
import { captureFormFields } from "@/lib/capture-submit";

export const dynamic = "force-dynamic";

export default async function CaptureFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const supabase = getAnonSupabase();
    if (!supabase) notFound();
    const { data: form, error } = await supabase
      .from("capture_forms")
      .select("id, slug, title, description, fields, success_message")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !form) notFound();

    return (
      <Suspense>
        <CaptureFormClient
          slug={form.slug}
          title={form.title}
          description={form.description}
          fields={captureFormFields(form.fields)}
          successMessage={form.success_message}
        />
      </Suspense>
    );
  } catch {
    notFound();
  }
}
