"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { all_routes } from "@/router/all_routes";

const ITEMS = [
  { href: all_routes.profile, label: "Profil" },
  { href: all_routes.security, label: "Sécurité" },
  { href: all_routes.pipelines, label: "Pipelines procédures" },
  { href: all_routes.notification, label: "Notifications" },
  { href: all_routes.connectedApps, label: "Canaux et clés API" },
] as const;

export default function GeneralSettingsNav() {
  const pathname = usePathname();
  return (
    <div className="card mb-3 mb-xl-0">
      <div className="card-body">
        <div className="settings-sidebar">
          <h5 className="mb-3 fs-17">Paramètres généraux</h5>
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
