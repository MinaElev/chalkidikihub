'use client';

import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  suffix?: string;
}

/**
 * Mobile-friendly number input with explicit +/- buttons.
 * Native <input type="number"> spinners are hidden on mobile,
 * so users struggle to increment/decrement values. This component
 * adds tap-friendly buttons that work everywhere.
 */
export default function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 99999,
  step = 1,
  required = false,
  suffix,
}: NumberStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const decrement = () => {
    if (canDecrement) onChange(Math.max(min, value - step));
  };

  const increment = () => {
    if (canIncrement) onChange(Math.min(max, value + step));
  };

  return (
    <div className="flex items-stretch w-full border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement}
        aria-label="Decrease"
        className="flex items-center justify-center w-12 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-300 transition-colors"
      >
        <Minus className="w-5 h-5 text-gray-700" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min={min}
        max={max}
        // step="any" disables the browser's "value must be a multiple of step
        // offset from min" validation, so typing 1110 when step=5 is fine.
        // The `step` prop controls only what the +/- buttons add/subtract.
        step="any"
        required={required}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
        className="flex-1 min-w-0 px-3 py-3 text-center font-medium text-gray-900 focus:outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {suffix && (
        <div className="flex items-center px-3 bg-gray-50 border-l border-gray-300 text-sm text-gray-600">
          {suffix}
        </div>
      )}

      <button
        type="button"
        onClick={increment}
        disabled={!canIncrement}
        aria-label="Increase"
        className="flex items-center justify-center w-12 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border-l border-gray-300 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
