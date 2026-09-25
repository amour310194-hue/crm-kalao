"use client";

import ImageWithBasePath from "@/core/common/imageWithBasePath";

export function kalaoInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "K";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

type Props = {
  name: string;
  image?: string | null;
  className?: string;
};

/** Photos réelles seulement. Les avatar-NN du template ne s’affichent pas. */
export default function KalaoAvatar({ name, image, className }: Props) {
  const real =
    image &&
    !/^avatar-\d+\.(jpe?g|png|webp|svg)$/i.test(image) &&
    !image.includes("/profiles/avatar-");
  if (real) {
    const src = image.startsWith("assets/") || image.startsWith("/") ? image : `assets/img/profiles/${image}`;
    return (
      <ImageWithBasePath
        src={src.replace(/^\//, "")}
        alt={name}
        className={className || "rounded-circle"}
      />
    );
  }
  return <span className={`kalao-initials ${className ?? ""}`}>{kalaoInitials(name)}</span>;
}
