import React from "react";

const Fallbackloading = () => {
  return (
    <div class="flex flex-row gap-2">
      <div class="w-7 h-7 rounded-full bg-blue-700 animate-bounce"></div>
      <div class="w-7 h-7 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
      <div class="w-7 h-7 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};

export default Fallbackloading;
