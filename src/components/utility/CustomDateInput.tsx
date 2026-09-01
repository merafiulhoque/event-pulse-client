'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface IndianDateInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const IndianDateInput = React.forwardRef<HTMLInputElement, IndianDateInputProps>(
  ({ value = '', onChange, onBlur, placeholder = "DD-MM-YYYY", className = "", error = false }, ref) => {
    
    // Convert initial ISO/stored value (YYYY-MM-DD) to display value (DD-MM-YYYY)
    const formatToDisplay = (isoStr: string) => {
      if (!isoStr) return '';
      if (/^\d{2}-\d{2}-\d{4}$/.test(isoStr)) return isoStr; // Already DD-MM-YYYY
      const parts = isoStr.split(/[-/.]/);
      if (parts.length === 3 && parts[0].length === 4) {
        // YYYY-MM-DD -> DD-MM-YYYY
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return isoStr;
    };

    const [displayVal, setDisplayVal] = useState(formatToDisplay(value));

    useEffect(() => {
      setDisplayVal(formatToDisplay(value));
    }, [value]);

    // Handle typing and auto-formatting
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/\D/g, ''); // Remove all non-digits
      if (raw.length > 8) raw = raw.slice(0, 8); // Max 8 digits (DDMMYYYY)

      let formatted = '';
      if (raw.length > 4) {
        formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
      } else if (raw.length > 2) {
        formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
      } else {
        formatted = raw;
      }

      setDisplayVal(formatted);

      // If we have a full 8-digit date, convert to ISO (YYYY-MM-DD) for parent form/API consumption
      if (raw.length === 8) {
        const day = raw.slice(0, 2);
        const month = raw.slice(2, 4);
        const year = raw.slice(4, 8);
        onChange(`${year}-${month}-${day}`);
      } else {
        // Pass empty or partial string if incomplete
        onChange(formatted);
      }
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type="text"
          value={displayVal}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={10}
          className={`w-full bg-slate-950/80 border ${
            error ? 'border-rose-500/80' : 'border-slate-800/80'
          } rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner ${className}`}
        />
      </div>
    );
  }
);

IndianDateInput.displayName = 'IndianDateInput';