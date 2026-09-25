
import BootstrapJs from "@/core/common/bootstrap-js/bootstrapjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "@/index.scss"; // Adjust path if needed

export const metadata = {
  title: {
    default: "Kalao CRM",
    template: "%s | Kalao CRM",
  },
  description: "CRM Groupe Kalao — dossiers, facturation et suivi client.",
  authors: [{ name: "Groupe Kalao" }],
  icons: {
    icon: "/assets/img/kalao-logo.jpg",
    shortcut: "/assets/img/kalao-logo.jpg",
    apple: "/assets/img/kalao-logo.jpg",
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
        {children}
        <BootstrapJs />
      </body>
    </html>
  );
}
