import React from "react";
import { Loader2 } from "lucide-react";
const FallbackUI = () => {
  return (
    <div className="h-w-screen h-screen flex justify-center items-center ">
      <Loader2 className="animate-spin" size={35} />
    </div>
  );
};

export default FallbackUI;
