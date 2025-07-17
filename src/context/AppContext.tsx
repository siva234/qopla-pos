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

import { calculateTotalPrice } from '../utils/calculations';

interface AppContextType {
  product: Product | null;
  addonGroups: AddonGroup[];
  selectedModifications: SelectedModifications;
  selectedAddons: SelectedAddons;
  totalPrice: number;
  handleModificationSelect: SelectionHandler;
  incrementAddon: AddonIncrementHandler;
  decrementAddon: AddonDecrementHandler;
  error: string | null;
  
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
       if (!productData || !productData.id || typeof productData.price !== 'number') {
        throw new Error("Product data is invalid or missing.");
      }
      if (!Array.isArray(addonsData)) {
        throw new Error("Addons data is invalid or missing.");
      }
      
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
  } catch (e: any) {
    console.error("Failed to initialize app state: ", e);
    setError(e.message || "An unknown error has occured during setup");
  }
  }, []);

  const handleModificationSelect: SelectionHandler = (modificationType, optionName) => {
    setSelectedModifications((prev) => ({ ...prev, [modificationType]: optionName }));
  };

  const getAddonTotalForGroup = (group: AddonGroup): number => {
    return group.addons.reduce((total, currentAddon) => {
      return total + (selectedAddons[currentAddon.addon.name] || 0);
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
    if (!product) {
      return 0;
    }
    return calculateTotalPrice({
      product,
      selectedModifications,
      selectedAddons,
      addonGroups,
    });
  }, [product, selectedModifications, selectedAddons, addonGroups]);

  const value = useMemo(() => ({
    product,
    addonGroups,
    selectedModifications,
    selectedAddons,
    totalPrice,
    error,
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