import React from "react";
export default function ItemSeller({ name, image, price }) {
  return (
    <div className="rounded-xl flex items-center justify-center flex-col overflow-hidden hover:transform hover:scale-105 transition duration-300 ease-in-out">
      <span className="bg-[#00205a] text-lg font-medium py-3 text-white px-4 rounded-e-sm rounded-es-none rounded-xl w-full tracking-wide text-ellipsis whitespace-nowrap overflow-hidden select-none">
        {name}
      </span>
      <div className="relative">
        <span className="absolute select-none text-3xl top-2 left-2 text-black font-semibold">
          {price}
        </span>
        <img src={image} className="rounded-s-sm" alt={name} />
      </div>
    </div>
  );
}
