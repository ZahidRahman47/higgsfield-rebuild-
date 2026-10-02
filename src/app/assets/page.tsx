import { Suspense } from "react";
import AssetsView from "@/components/AssetsView";

export const metadata = { title: "Assets" };

export default function Page() {
  return (
    <Suspense>
      <AssetsView />
    </Suspense>
  );
}
