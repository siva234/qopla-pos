import React, { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import type {
    Product,
    AddonGroup,
    SelectedModifications,
    SelectionHandler,
    SelectedAddons,
    AddonIncrementHandler,
    AddonDecrementHandler,
} from '../types';

import productData from '../data/product.json';
import addonsData from '../data/addons.json';

interface AppContextType {
  product: Product | null;
  addonGroups: AddonGroup[];
  selectedModifications: SelectedModifications;
  selectedAddons: SelectedAddons;
  totalPrice: number;
  handleModificationSelect: SelectionHandler;
  incrementAddon: AddonIncrementHandler;
  decrementAddon: AddonDecrementHandler;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);
  const [selectedModifications, setSelectedModifications] = useState<SelectedModifications>({});

  const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});

  useEffect(() => {
    const currentProduct = productData as Product;
    setProduct(currentProduct);
    setAddonGroups(addonsData as AddonGroup[]);
    const initialSelections: SelectedModifications = {};
    if (currentProduct.modifications) {
      for (const type in currentProduct.modifications) {
        const options = currentProduct.modifications[type];
        if (options?.length > 0) {
          initialSelections[type] = options[0].name;
        }
      }
    }
    setSelectedModifications(initialSelections);
  }, []);

  const handleModificationSelect: SelectionHandler = (modificationType, optionName) => {
    setSelectedModifications((prev) => ({ ...prev, [modificationType]: optionName }));
  };
  
  // --- ADDON LOGIC ---
  const getAddonTotalForGroup = (group: AddonGroup): number => {
    return group.addons.reduce((total, currentAddon) => {
      const count = selectedAddons[currentAddon.addon.name] || 0;
      return total + count;
    }, 0);
  };

  const incrementAddon: AddonIncrementHandler = (groupAddon, group) => {
    const addonName = groupAddon.addon.name;
    const currentCount = selectedAddons[addonName] || 0;
    const groupTotal = getAddonTotalForGroup(group);

    if (currentCount >= groupAddon.limit || groupTotal >= group.limit) {
      console.warn("Addon limit reached.");
      return;
    }

    setSelectedAddons(prev => ({ ...prev, [addonName]: currentCount + 1 }));
  };

  const decrementAddon: AddonDecrementHandler = (addonName) => {
    const currentCount = selectedAddons[addonName];
    if (!currentCount) return;
    if (currentCount > 1) {
      setSelectedAddons(prev => ({ ...prev, [addonName]: currentCount - 1 }));
    } else {
      const { [addonName]: _, ...rest } = selectedAddons;
      setSelectedAddons(rest);
    }
  };

   const totalPrice = useMemo(() => {
    if (!product) return 0;

    let total = product.price;

    if (product.modifications) {
      for (const type in selectedModifications) {
        const selectedOptionName = selectedModifications[type];
        const modificationOptions = product.modifications[type];
        const selectedOption = modificationOptions?.find(opt => opt.name === selectedOptionName);
        if (selectedOption) {
          total += selectedOption.addonPrice;
        }
      }
    }

    for (const addonName in selectedAddons) {
      const quantity = selectedAddons[addonName];
      const addon = addonGroups
        .flatMap(group => group.addons)
        .find(a => a.addon.name === addonName);
      
      if (addon) {
        total += parseFloat(addon.addon.price) * quantity;
      }
    }

    return total;
  }, [product, selectedModifications, selectedAddons, addonGroups]);



  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    product,
    addonGroups,
    selectedModifications,
    selectedAddons,
    totalPrice,
    handleModificationSelect,
    incrementAddon,
    decrementAddon,
  }), [product, addonGroups, selectedModifications, selectedAddons, totalPrice]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};