"use client";

import { useI18n } from "@/i18n/I18nProvider";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const { t } = useI18n();
  return (
    <div className="datatable-search">
      <input
        type="search"
        className="form-control"
        placeholder={t("Search")}
        aria-controls="DataTables_Table_0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
