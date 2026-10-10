'use client';

import { useEffect, useState } from 'react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  required?: boolean;
  suffix?: string;
  placeholder?: string;
}

/**
 * Free-typing price input — no +/- spinner buttons.
 *
 * Why a dedicated component instead of NumberStepper / <input type="number">:
 *  - Controlled number inputs make the field impossible to clear (Number('') === 0),
 *    so a leading "0" stays put and users end up typing "0100" instead of "100".
 *  - Native spinners + step validation confuse owners entering arbitrary prices.
 *
 * Solution: keep a local *string* so the user can clear the field and type freely.
 * Leading zeros are stripped, only digits + one decimal separator are allowed, and
 * the numeric value is pushed to the parent on every change. The min is enforced
 * on blur (so an in-progress empty field isn't snapped back to min while typing).
 */
export default function PriceInput({
  value,
  onChange,
  min = 1,
  required = false,
  suffix = '€',
  placeholder,
}: PriceInputProps) {
  const [text, setText] = useState(value > 0 ? String(value) : '');

  // Resync only when the external value changes to something different from what's
  // already typed (e.g. edit page loads data async, or a form reset). Guarding on
  // equality prevents this from wiping an in-progress entry like "10." on each keystroke.
  useEffect(() => {
    const current = parseFloat(text);
    const same = current === value || (isNaN(current) && value === 0);
    if (!same) setText(value > 0 ? String(value) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex items-stretch w-full border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
      <input
        type="text"
        inputMode="decimal"
        required={required}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          // Allow digits + a single decimal separator; normalise comma to dot.
          let raw = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
          // Collapse multiple dots to the first one.
          const firstDot = raw.indexOf('.');
          if (firstDot !== -1) {
            raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '');
          }
          // Strip leading zeros ("0100" -> "100") but keep a single "0" before a decimal ("0.5").
          raw = raw.replace(/^0+(?=\d)/, '');
          setText(raw);
          const n = parseFloat(raw);
          onChange(isNaN(n) ? 0 : n);
        }}
        onBlur={() => {
          const n = parseFloat(text);
          if (isNaN(n) || n < min) {
            const fixed = isNaN(n) ? min : Math.max(min, n);
            setText(String(fixed));
            onChange(fixed);
          } else {
            // Normalise display (e.g. "100." -> "100")
            setText(String(n));
          }
        }}
        className="flex-1 min-w-0 px-3 py-3 text-center font-medium text-gray-900 focus:outline-none bg-white"
      />
      {suffix && (
        <div className="flex items-center px-3 bg-gray-50 border-l border-gray-300 text-sm text-gray-600">
          {suffix}
        </div>
      )}
    </div>
  );
}
