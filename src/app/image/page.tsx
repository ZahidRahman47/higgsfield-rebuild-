import { Suspense } from "react";
import ImageStudio from "@/components/create/ImageStudio";

export const metadata = { title: "Create Image" };

export default function Page() {
  return (
    <Suspense>
      <ImageStudio />
    </Suspense>
  );
}
