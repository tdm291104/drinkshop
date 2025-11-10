import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin h-16 w-16 text-[var(--chart-3)]" />
    </div>
  );
};

export default Loading;
