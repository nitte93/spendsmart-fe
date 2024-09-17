"use client";
import React, { useState } from "react";
interface Props {
  children: React.ReactNode;
}

function UploadComponent({ children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-gradient-to-r from-slate-600 via-gray-500 to-zink-800 p-1">
      <div className="p-4 bg-white h-full rounded shadow-md">{children}</div>
    </div>
  );
}

export default UploadComponent;
