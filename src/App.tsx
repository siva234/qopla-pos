import React from 'react';
import { ModificationSelector } from './components/ModificationSelector';
import { AddonSelector } from './components/AddonSelector';
import { useAppContext } from './context/AppContext';
import { PriceDisplay } from './components/PriceDisplay';

const App: React.FC = () => {
  const { product, error, selectedModifications, selectedAddons, handleModificationSelect } = useAppContext();
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold text-red-700">Failed to Load Application</h1>
          <p className="mt-2 text-slate-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return <div className="p-8">Loading Product...</div>;
  }

  return (
    <div className="min-h-2xl bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto min-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Customize {product.name}
        </h1>
        <div className="flex flex-col space-y-6">
          {product.modifications && (
            <ModificationSelector
              modifications={product.modifications}
              selectedModifications={selectedModifications}
              onSelect={handleModificationSelect}
            />
          )}

          <AddonSelector />
        </div>
        <PriceDisplay />

        {/* State display */}
        <div className="mt-8">
          <h3 className="font-bold tracking-tight text-slate-900">Current State:</h3>
          <pre className="mt-2 rounded-lg bg-slate-800 p-4 text-sm text-white">
            <code>
              {JSON.stringify({ selectedModifications, selectedAddons }, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;