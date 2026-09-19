"use client";
/* eslint-disable @next/next/no-img-element */
import { DateRangePicker } from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { useEffect, useRef, useState } from "react";

export type DatePickerRange = { from: Date; to: Date };
export type DatePickerPreset = "today" | "thisMonth" | "last30";

type Props = {
  onChange?: (range: DatePickerRange) => void;
  defaultPreset?: DatePickerPreset;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function rangeFromPreset(now: Date, preset: DatePickerPreset): DatePickerRange {
  if (preset === "thisMonth") {
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
      to: endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
    };
  }
  if (preset === "last30") {
    return {
      from: startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)),
      to: endOfDay(now),
    };
  }
  return { from: startOfDay(now), to: endOfDay(now) };
}

export default function PredefinedDatePicker({ onChange, defaultPreset = "today" }: Props) {
  const now = new Date();
  const initialRange = rangeFromPreset(now, defaultPreset);
  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
  const endOfLastMonth = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));

  const initialSettings = {
    startDate: initialRange.from,
    endDate: initialRange.to,
    ranges: {
      "30 derniers jours": [
        startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)),
        endOfToday,
      ],
      "7 derniers jours": [
        startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)),
        endOfToday,
      ],
      "Mois dernier": [startOfLastMonth, endOfLastMonth],
      "Ce mois": [startOfMonth, endOfMonth],
      "Aujourd'hui": [startOfToday, endOfToday],
      Hier: [
        startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)),
        endOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)),
      ],
    },
    timePicker: false,
    locale: {
      format: "DD MMMM YYYY",
      applyLabel: "Appliquer",
      cancelLabel: "Annuler",
      customRangeLabel: "Personnalisé",
    },
  };

  const [displayValue, setDisplayValue] = useState(
    `${formatDate(initialRange.from)} - ${formatDate(initialRange.to)}`
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(initialRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = (from: Date, to: Date) => {
    const next = { from: startOfDay(from), to: endOfDay(to) };
    setDisplayValue(`${formatDate(next.from)} - ${formatDate(next.to)}`);
    onChangeRef.current?.(next);
  };

  const handleShow = (_event: unknown, picker: { startDate: { toDate: () => Date }; endDate: { toDate: () => Date } }) => {
    setDisplayValue(`${formatDate(picker.startDate.toDate())} - ${formatDate(picker.endDate.toDate())}`);
  };

  const handleApply = (_event: unknown, picker: { startDate: { toDate: () => Date }; endDate: { toDate: () => Date } }) => {
    emit(picker.startDate.toDate(), picker.endDate.toDate());
  };

  return (
    <div className="form-control w-auto d-flex align-items-center" data-date-filter>
      <i className="ti ti-calendar text-dark me-2" />
      <DateRangePicker initialSettings={initialSettings} onApply={handleApply} onShow={handleShow}>
        <input
          ref={inputRef}
          type="text"
          className="reportrange-picker-field text-dark border-0 shadow-none"
          value={displayValue}
          readOnly
        />
      </DateRangePicker>
    </div>
  );
}
