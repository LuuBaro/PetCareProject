import React from "react";

export default function PolicyItem({ imgSrc, title, description }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <img src={imgSrc} className="h-[75px]" alt="" />
      <div className="text-white">
        <h2 className="font-medium text-lg">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
