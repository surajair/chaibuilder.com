import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="h-screen w-screen bg-white/30 absolute inset-0 z-50 flex justify-center items-center">
      <div className="size-10 bg-white rounded-full flex items-center justify-center border">
        <Loader2 className="size-5 animate-spin" />
      </div>
    </div>
  );
}
