import React, { useState, useMemo } from 'react';
import type { Modifications, SelectedModifications, SelectionHandler } from '../types';
import { ChevronIcon } from './ChevronIcon';

interface ModificationSelectorProps {
  modifications: Modifications;
  selectedModifications: SelectedModifications;
  onSelect: SelectionHandler;
}

const formatTitle = (title: string): string => title.charAt(0).toUpperCase() + title.slice(1);

export const ModificationSelector: React.FC<ModificationSelectorProps> = ({
  modifications,
  selectedModifications,
  onSelect,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const extraPrice = useMemo(() => {
    let total = 0;
    if (!modifications) return 0;

    for (const type in selectedModifications) {
      const selectedOptionName = selectedModifications[type];
      const selectedOption = modifications[type]?.find(opt => opt.name === selectedOptionName);
      if (selectedOption) {
        total += selectedOption.addonPrice;
      }
    }
    return total;
  }, [modifications, selectedModifications]);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      <div className="border border-slate-300 flex cursor-pointer items-center justify-between p-4"
        onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-3">
          <ChevronIcon isCollapsed={isCollapsed} />
          <h2 className="select-none text-xl font-bold text-slate-800">Modifications</h2>
        </div>
        {extraPrice > 0 && (<span className="font-semibold text-blue-600">+{extraPrice} kr</span>)}
      </div>

      {!isCollapsed && (
        <div className="flex flex-col space-y-5 px-4 pb-4 pt-0">
          {Object.entries(modifications).map(([type, options]) => (
            <div key={type}>
              <h3 className="mb-3 text-lg font-semibold text-slate-700">{formatTitle(type)}</h3>
              <div className="flex flex-wrap gap-3">
                {options.map((option) => {
                  const isSelected = selectedModifications[type] === option.name;
                  const baseClasses = "flex flex-col items-center justify-center rounded-md border-2 px-5 py-3 text-center transition-colors duration-200 min-w-[110px] cursor-pointer";
                  const stateClasses = isSelected
                    ? "border-blue-500 bg-blue-500 text-white font-semibold"
                    : "border-slate-300 bg-white hover:border-blue-500 hover:text-blue-500";
                  
                  return (
                    <button
                      key={option.name}
                      className={`${baseClasses} ${stateClasses}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(type, option.name);
                      }}
                    >
                      <span className="text-base">{option.name}</span>
                      {option.addonPrice > 0 && (
                        <span className="mt-1 text-sm opacity-90">+{option.addonPrice} kr</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};