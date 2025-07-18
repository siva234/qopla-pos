import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../context/AppContext';
import { AddonSelector } from '../components/AddonSelector';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('AddonSelector', () => {

  it('should disable the add button when the item limit is reached', async () => {
    renderWithProvider(<AddonSelector />);

    const icecreamAddon = await screen.findByText('Vanilla icecream');
    const addButton = icecreamAddon.parentElement!.parentElement!.querySelector('button:last-child') as HTMLButtonElement;

    fireEvent.click(addButton);

    expect(addButton).toBeDisabled();
  });

  it('should disable other addon buttons when the group limit is reached', async () => {
    renderWithProvider(<AddonSelector />);

    const vanillaAddon = await screen.findByText('Vanilla icecream');
    const vanillaAddButton = vanillaAddon.parentElement!.parentElement!.querySelector('button:last-child') as HTMLButtonElement;
    
    const marshmallowAddon = await screen.findByText('Marshmallow');
    const marshmallowAddButton = marshmallowAddon.parentElement!.parentElement!.querySelector('button:last-child') as HTMLButtonElement;

    const whippedCreamAddon = await screen.findByText('Whipped cream');
    const whippedCreamAddButton = whippedCreamAddon.parentElement!.parentElement!.querySelector('button:last-child') as HTMLButtonElement;

    fireEvent.click(vanillaAddButton); 
    fireEvent.click(marshmallowAddButton); 

    expect(whippedCreamAddButton).toBeDisabled();
    expect(vanillaAddButton).toBeDisabled();
    expect(marshmallowAddButton).toBeDisabled();
  });
});