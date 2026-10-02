"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useStudio } from "@/lib/store";
import { useResumePending } from "@/lib/use-generate";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, refetchOnWindowFocus: false } } }),
  );
  useEffect(() => {
    void Promise.resolve(useStudio.persist.rehydrate()).then(() => useStudio.getState().refill());
  }, []);
  useResumePending();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
