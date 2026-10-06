"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { all_routes } from "@/router/all_routes";

const ITEMS = [
  { href: all_routes.companySettings, label: "Société" },
  { href: all_routes.localization, label: "Localisation" },
  { href: all_routes.prefixes, label: "Préfixes" },
  { href: all_routes.preference, label: "Préférences" },
  { href: all_routes.appearance, label: "Apparence" },
  { href: all_routes.languageWeb, label: "Langue" },
] as const;

export default function WebsiteSettingsNav() {
  const pathname = usePathname();
  return (
    <div className="card filemanager-left-sidebar mb-3 mb-xl-0">
      <div className="card-body">
        <div className="settings-sidebar">
          <h5 className="mb-3 fs-17">Paramètres du site</h5>
          <div className="list-group list-group-flush settings-sidebar">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`d-block p-2 fw-medium${pathname === item.href ? " active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
