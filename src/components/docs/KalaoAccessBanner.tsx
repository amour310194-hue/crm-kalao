"use client";

export default function KalaoAccessBanner({
  children,
}: {
  children: string;
}) {
  return (
    <div className="alert alert-light border mb-3">
      <p className="mb-0 fw-semibold">{children}</p>
    </div>
  );
}
