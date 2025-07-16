import type { Product, SelectedModifications, SelectedAddons, AddonGroup } from '../types';

interface CalculatePriceArgs {
  product: Product;
  selectedModifications: SelectedModifications;
  selectedAddons: SelectedAddons;
  addonGroups: AddonGroup[];
}

export function calculateTotalPrice({
  product,
  selectedModifications,
  selectedAddons,
  addonGroups,
}: CalculatePriceArgs): number {
  if (!product) return 0;

  let total = product.price;

  if (product.modifications) {
    for (const type in selectedModifications) {
      const selectedOptionName = selectedModifications[type];
      const selectedOption = product.modifications[type]?.find(opt => opt.name === selectedOptionName);
      if (selectedOption) {
        total += selectedOption.addonPrice;
      }
    }
  }

  const allAddons = addonGroups.flatMap(group => group.addons);
  for (const addonName in selectedAddons) {
    const quantity = selectedAddons[addonName];
    const addon = allAddons.find(a => a.addon.name === addonName);
    if (addon) {
      total += parseFloat(addon.addon.price) * quantity;
    }
  }

  return total;
}