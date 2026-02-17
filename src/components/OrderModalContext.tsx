'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { OrderModal } from '@/components/OrderModal';

type OrderModalContextValue = {
  openOrder: () => void;
  closeOrder: () => void;
};

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openOrder = useCallback(() => setOpen(true), []);
  const closeOrder = useCallback(() => setOpen(false), []);

  return (
    <OrderModalContext.Provider value={{ openOrder, closeOrder }}>
      {children}
      <OrderModal open={open} onClose={closeOrder} />
    </OrderModalContext.Provider>
  );
}

export function useOrderModal(): OrderModalContextValue {
  const ctx = useContext(OrderModalContext);
  if (!ctx) throw new Error('useOrderModal must be used within OrderModalProvider');
  return ctx;
}
