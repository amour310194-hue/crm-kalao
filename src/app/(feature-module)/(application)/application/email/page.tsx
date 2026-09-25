import MailApp from "@/components/mail/MailApp";

export const metadata = {
  title: "Messagerie — Kalao CRM",
};

export default function Email() {
  return (
    <div className="page-wrapper">
      <div className="content p-0">
        <MailApp />
      </div>
    </div>
  );
}
