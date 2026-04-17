'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Props {
  listingId: string;
}

interface AvailabilityRow {
  date: string;
  status: 'blocked' | 'booked';
}

type CellStatus = 'available' | 'blocked' | 'booked';

const MONTH_NAMES: Record<string, string[]> = {
  el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  bg: ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  ro: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
  sr: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
};

const DAY_NAMES: Record<string, string[]> = {
  el: ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  bg: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  ro: ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'],
  sr: ['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne'],
};

const LABELS: Record<string, { title: string; available: string; unavailable: string }> = {
  el: { title: 'Διαθεσιμότητα', available: 'Διαθέσιμη', unavailable: 'Μη διαθέσιμη' },
  en: { title: 'Availability', available: 'Available', unavailable: 'Unavailable' },
  de: { title: 'Verfügbarkeit', available: 'Verfügbar', unavailable: 'Nicht verfügbar' },
  bg: { title: 'Наличност', available: 'Налична', unavailable: 'Не е налична' },
  ru: { title: 'Доступность', available: 'Доступно', unavailable: 'Недоступно' },
  ro: { title: 'Disponibilitate', available: 'Disponibil', unavailable: 'Indisponibil' },
  sr: { title: 'Dostupnost', available: 'Dostupno', unavailable: 'Nije dostupno' },
};

export function PublicAvailabilityCalendar({ listingId }: Props) {
  const locale = useLocale();
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [anchorMonth, setAnchorMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const today = new Date();
      today.setDate(today.getDate() - 1);
      const { data } = await supabase
        .from('listing_availability')
        .select('date, status')
        .eq('listing_id', listingId)
        .gte('date', today.toISOString().slice(0, 10));
      if (data) setRows(data as AvailabilityRow[]);
      setLoaded(true);
    })();
  }, [listingId]);

  const statusByDate = useMemo(() => {
    const m = new Map<string, CellStatus>();
    rows.forEach(r => m.set(r.date, r.status));
    return m;
  }, [rows]);

  // If no availability data set at all, hide the calendar (not all owners use it)
  if (loaded && rows.length === 0) return null;

  const months = [0, 1].map(offset => {
    const d = new Date(anchorMonth);
    d.setMonth(d.getMonth() + offset);
    return d;
  });

  const L = LABELS[locale] || LABELS.en;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-600" />
          {L.title}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const d = new Date(anchorMonth);
              d.setMonth(d.getMonth() - 1);
              setAnchorMonth(d);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date(anchorMonth);
              d.setMonth(d.getMonth() + 1);
              setAnchorMonth(d);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {months.map(m => (
          <ReadOnlyMonthGrid
            key={`${m.getFullYear()}-${m.getMonth()}`}
            month={m}
            statusByDate={statusByDate}
            locale={locale}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          {L.available}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
          {L.unavailable}
        </div>
      </div>
    </div>
  );
}

function ReadOnlyMonthGrid({
  month,
  statusByDate,
  locale,
}: {
  month: Date;
  statusByDate: Map<string, CellStatus>;
  locale: string;
}) {
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const firstDay = new Date(year, monthIdx, 1);
  const lastDay = new Date(year, monthIdx + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = MONTH_NAMES[locale] || MONTH_NAMES.en;
  const dayNames = DAY_NAMES[locale] || DAY_NAMES.en;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, monthIdx, d));
  while (cells.length % 7 !== 0) cells.push(null);

  function pad(n: number) {
    return String(n).padStart(2, '0');
  }

  return (
    <div>
      <h4 className="text-center font-semibold text-gray-800 text-sm mb-2">
        {monthNames[monthIdx]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-0.5 mb-0.5">
        {dayNames.map((dn, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-gray-500 py-1">
            {dn}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const dateStr = `${cell.getFullYear()}-${pad(cell.getMonth() + 1)}-${pad(cell.getDate())}`;
          const status = statusByDate.get(dateStr) || 'available';
          const isPast = cell < today;

          let bg = 'bg-white border-gray-200';
          if (status === 'blocked' || status === 'booked') bg = 'bg-red-200 border-red-400';

          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-xs rounded border ${bg} ${
                isPast ? 'opacity-30' : ''
              }`}
            >
              {cell.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
