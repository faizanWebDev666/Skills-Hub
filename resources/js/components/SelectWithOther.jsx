import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SelectWithOther = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  customValue,
  onCustomValueChange,
  className = '',
  required = false,
  error = null,
}) => {
  const isOther = value === 'Other';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value !== 'Other') {
            onCustomValueChange('');
          }
        }}
        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>
      
      <AnimatePresence>
        {isOther && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              value={customValue}
              onChange={(e) => onCustomValueChange(e.target.value)}
              placeholder={`Custom ${label?.toLowerCase() || 'value'}`}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm mt-2"
              required={required && isOther}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SelectWithOther;
