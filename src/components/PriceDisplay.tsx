import React from 'react';
import { useAppContext } from '../context/AppContext';

export const PriceDisplay: React.FC = () => {
  const { totalPrice } = useAppContext();

  return (
    <div className="mt-8">
      <hr className="mb-4 border-t border-slate-200" />
      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-4">
        <span className="text-lg font-bold text-slate-800">Total Price:</span>
        <span className="text-2xl font-extrabold text-blue-600">
          {totalPrice.toFixed(2)} kr
        </span>
      </div>

      <button className="mt-4 w-full rounded-lg bg-green-500 py-4 text-xl font-bold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
        Add to Bill
      </button>
    </div>
  );
};