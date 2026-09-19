"use client";

import { useState } from "react";
import KalaoFormModal from "@/components/Pages/kalao/KalaoFormModal";
import { useI18n } from "@/i18n/I18nProvider";

type CrmLiveAddProps = {
  resource: string;
  label: string;
};

const CrmLiveAdd = ({ resource, label }: CrmLiveAddProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        <i className="ti ti-square-rounded-plus-filled me-1" />
        {t(label)}
      </button>
      <KalaoFormModal
        resource={resource}
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => window.location.reload()}
      />
    </>
  );
};

export default CrmLiveAdd;
