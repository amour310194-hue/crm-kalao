"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { Lang } from "@/i18n/dictionary";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="dropdown d-flex align-items-center">
      <select
        className="form-select form-select-sm shadow-none border"
        aria-label={t("Language")}
        value={lang}
        onChange={(event) => setLang(event.target.value as Lang)}
        style={{ minWidth: 110 }}
      >
        <option value="fr">FR — {t("French")}</option>
        <option value="en">EN — {t("English")}</option>
      </select>
    </div>
  );
}
