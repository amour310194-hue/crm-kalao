
import BootstrapJs from "@/core/common/bootstrap-js/bootstrapjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "@/index.scss"; // Adjust path if needed

import { COMPANY_NAME, SITE_NAME, SITE_URL } from "@/lib/site";
import AppProviders from "@/components/providers/AppProviders";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: `CRM ${COMPANY_NAME} — ventes de produits et de services`,
  keywords: "CRM, Groupe Kalao, ventes, produits, services",
  authors: [{ name: COMPANY_NAME }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png", // Add shortcut icon for better support
    apple: "/apple-icon.png", // Optional: for Apple devices (place in `public/`)
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
        <BootstrapJs />
      </body>
    </html>
  );
}
