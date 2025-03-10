"use client";
import React from "react";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[999] text-white/80 text-xl">
      <Loader2 className="w-8 h-8 p-1 animate-spin" />
      Loading...
    </div>
  );
};

export default Loader;
