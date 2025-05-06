import React from "react";

const Loading = () => {
  return (
    <div class="flex-col gap-4 w-full flex items-center justify-center">
      <div class="w-30 h-30 border-4 border-transparent text-blue-700 text-4xl animate-spin flex items-center justify-center border-t-blue-700 rounded-full">
        <div class="w-26 h-26 border-4 border-transparent text-zinc-400 text-2xl animate-spin flex items-center justify-center border-t-zinc-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loading;
