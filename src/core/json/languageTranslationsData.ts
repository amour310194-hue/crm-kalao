/*
  Translation strings for the Language edit view (html/language-web-edit.html).

  The reference hardcodes these rows in the table markup; they are lifted here so
  the page renders from data like the rest of the ported settings pages.
*/

export interface LanguageTranslationData {
  key: string;
  English: string;
  Arabic: string;
}

export const LanguageTranslationsData: LanguageTranslationData[] = [
  { key: "1", English: "Name", Arabic: "اسم" },
  // The reference pairs "Phone" with this string; kept verbatim.
  { key: "2", English: "Phone", Arabic: "الفواتير المتكررة" },
  { key: "3", English: "Email", Arabic: "بريد إلكتروني" },
  { key: "4", English: "Tags", Arabic: "العلامات" },
  { key: "5", English: "Location", Arabic: "موقع" },
  { key: "6", English: "Rating", Arabic: "تصنيف" },
  { key: "7", English: "Owner", Arabic: "مالك" },
];

export interface LanguageOptionData {
  Label: string;
  Flag: string;
}

export const LanguageOptionsData: LanguageOptionData[] = [
  { Label: "English", Flag: "assets/img/flags/us.svg" },
  { Label: "German", Flag: "assets/img/flags/de.svg" },
  { Label: "Arabic", Flag: "assets/img/flags/ae.svg" },
  { Label: "French", Flag: "assets/img/flags/fr.svg" },
];
