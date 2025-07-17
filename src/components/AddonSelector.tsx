import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronIcon } from './ChevronIcon';

export const AddonSelector: React.FC = () => {
  const {
    product,
    addonGroups,
    selectedAddons,
    incrementAddon,
    decrementAddon,
  } = useAppContext();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const summary = useMemo(() => {
    let additions = 0;
    let removals = 0;
    let extraPrice = 0;

    const allAddons = addonGroups.flatMap(g => g.addons);

    for (const addonName in selectedAddons) {
      const addonDetails = allAddons.find(a => a.addon.name === addonName);
      if (addonDetails) {
        if (parseFloat(addonDetails.addon.price) > 0) {
          additions += selectedAddons[addonName];
          extraPrice += parseFloat(addonDetails.addon.price) | 0;
        } else {
          removals += selectedAddons[addonName];
        }
      }
    }
    return { additions, removals, extraPrice };
  }, [selectedAddons, addonGroups]);

  const relevantGroups = useMemo(() => {
    if (!product) return [];
    return addonGroups
      .filter(group => group.refProductIds.includes(product.id))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [addonGroups, product]);

  if (!product || relevantGroups.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      <div className="border border-slate-300 flex cursor-pointer items-center justify-between p-4"
        onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-3">
          <ChevronIcon isCollapsed={isCollapsed} />
          <h2 className="select-none text-xl font-bold text-slate-800">Add-ons</h2>
        </div>
        {(summary.additions > 0 || summary.removals > 0) && (
          <div className="flex gap-4 font-semibold items-center">            
            {summary.extraPrice > 0 && (
              <span className="font-semibold text-blue-600">+{summary.extraPrice} kr </span>
            )}
            {summary.additions > 0 && (
              <div className='flex rounded-full bg-green-300 w-7 h-7 items-center justify-center'>
              <span className="text-green-600">{summary.additions}</span>
              </div>
            )}
            {summary.removals > 0 && (
              <div className='flex rounded-full bg-red-300 w-7 h-7 items-center justify-center'>
              <span className="text-red-600">{summary.removals}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex flex-col space-y-5 px-4 pb-4 pt-0">
          {relevantGroups.map((group) => {
            const groupTotal = group.addons.reduce((total, addon) => total + (selectedAddons[addon.addon.name] || 0), 0);
            return (
              <div key={group.name}>
                <h3 className="mb-1 text-lg font-semibold text-slate-700">{group.name}</h3>
                <p className="mb-3 text-sm text-slate-500">
                  You can select up to {group.limit} item(s). ({groupTotal}/{group.limit} selected)
                </p>
                <div className="flex flex-col space-y-3">
                  {group.addons.sort((a, b) => a.sortOrder - b.sortOrder).map((groupAddon) => {
                    const addon = groupAddon.addon;
                    const count = selectedAddons[addon.name] || 0;
                    const isIncrementDisabled = count >= groupAddon.limit || groupTotal >= group.limit;
                    return (
                       <div key={addon.name} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <p className="font-medium text-slate-800">{addon.name}</p>
                          {parseFloat(addon.price) > 0 && (<p className="text-sm text-slate-500">+{addon.price} kr</p>)}
                        </div>
                        <div className="flex items-center gap-2">
                          {count > 0 && (
                            <button onClick={() => decrementAddon(addon.name)} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white transition hover:bg-slate-300">−</button>
                          )}
                            <span className="w-8 text-center text-lg font-bold text-slate-800">
                                {count}
                            </span>
                          <button onClick={() => incrementAddon(groupAddon, group)} disabled={isIncrementDisabled} className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white transition hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};