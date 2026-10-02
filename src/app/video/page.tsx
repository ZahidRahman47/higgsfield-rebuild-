import { Suspense } from "react";
import VideoStudio from "@/components/create/VideoStudio";

export const metadata = { title: "Create Video" };

export default function Page() {
  return (
    <Suspense>
      <VideoStudio />
    </Suspense>
  );
}
