import { describe, it, expect } from 'vitest';
import { calculateTotalPrice } from '../utils/calculations';
import productData from '../data/product.json';
import addonsData from '../data/addons.json';

describe('calculateTotalPrice', () => {
  it('should return the base price when no modifications or addons are selected', () => {
    const total = calculateTotalPrice({
      product: productData,
      selectedModifications: {},
      selectedAddons: {},
      addonGroups: addonsData,
    });
    expect(total).toBe(30);
  });

  it('should add the price of a modification', () => {
    const total = calculateTotalPrice({
      product: productData,
      selectedModifications: { sizes: 'Extra large' },
      selectedAddons: {},
      addonGroups: addonsData,
    });
    expect(total).toBe(30 + 15);
  });

  it('should add the price of an addon', () => {
    const total = calculateTotalPrice({
      product: productData,
      selectedModifications: {},
      selectedAddons: { 'Whipped cream': 1 }, 
      addonGroups: addonsData,
    });
    expect(total).toBe(30 + 15);
  });

  it('should handle multiple addons and modifications together', () => {
    const total = calculateTotalPrice({
      product: productData,
      selectedModifications: { sizes: 'Extra large' }, 
      selectedAddons: {
        'Whipped cream': 1,
        'Marshmallow': 1, 
      },
      addonGroups: addonsData,
    });
    expect(total).toBe(30 + 15 + 10 + 15);
  });
});