'use client';

import { useOrderModal } from '@/components/OrderModalContext';
import { Hero } from './Hero';
import { About } from './About';
import { Stack } from './Stack';
import { Services } from './Services';
import { Reviews } from './Reviews';
import { OrderSection } from './OrderSection';

export function HomeContent() {
  const { openOrder } = useOrderModal();

  return (
    <>
      <Hero onOrderClick={openOrder} />
      <About />
      <Stack />
      <Services />
      <Reviews />
      <OrderSection onOrderClick={openOrder} />
    </>
  );
}
