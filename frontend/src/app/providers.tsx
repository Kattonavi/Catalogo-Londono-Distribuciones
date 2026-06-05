"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider>
      {/* reducedMotion="user" hace que TODAS las animaciones de motion
          respeten prefers-reduced-motion (tarjetas, hero, etc.). */}
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
