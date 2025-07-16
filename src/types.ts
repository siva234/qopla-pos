// Product & Modification Types
export type ModificationOption = {
  name: string;
  addonPrice: number;
}
export type Modifications = {
  sizes: ModificationOption[];
  flavours: ModificationOption[];
  [key: string]: ModificationOption[]; // Index signature for dynamic access
}
export type Product = {
  id: string;
  name: string;
  price: number;
  modifications?: Modifications;
}

// Addon Types
export type AddonBody = {
  name: string;
  price: string;
}
export type Addon = {
  addon: AddonBody;
  limit: number;
  sortOrder: number;
}
export type AddonGroup = {
  name: string;
  limit: number;
  sortOrder: number;
  refProductIds: string[];
  addons: Addon[];
}

// UI State Management Types
export type SelectedModifications = {
  [modificationType: string]: string | null;
};
export type SelectionHandler = (modificationType: string, optionName: string) => void;

export type SelectedAddons = {
  [addonName: string]: number;
};

export type AddonIncrementHandler = (groupAddon: Addon, group: AddonGroup) => void;
export type AddonDecrementHandler = (addonName: string) => void;