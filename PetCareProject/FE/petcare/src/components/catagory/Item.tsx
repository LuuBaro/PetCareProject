import React from "react";
import "/src/App.css";
export default function Item({ name, image }) {
  return (
    <div className="item-container flex items-center justify-center flex-col p-5 gap-2 border border-[#00B7C0]-200">
      <img src={image} alt={name} className="image-rotate h-14" />
      <p className="text-change text-sm">{name}</p>
    </div>
  );
}
