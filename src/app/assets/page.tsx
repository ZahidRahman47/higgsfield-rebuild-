import { Suspense } from "react";
import AssetsView from "@/components/AssetsView";

export const metadata = { title: "Assets · Higgsfield Rebuild" };

export default function Page() {
  return (
    <Suspense>
      <AssetsView />
    </Suspense>
  );
}
