import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

export default function ProductItem({ name, price, image, rating }) {
  return (
    <div className="flex justify-between mx-2 flex-col bg-white rounded-md border border-black-300 overflow-hidden">
      <img src={image} className="max-h-[150px] object-cover" alt={name} />
      <div className="p-4 h-fit">
        <div>
          <span className="font-semibold text-base block w-full tracking-wide text-ellipsis whitespace-nowrap overflow-hidden">
            {name}
          </span>
          <div className="text-yellow-500 select-none text-base">
            {"★".repeat(rating) + "☆".repeat(5 - rating)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="text-base font-medium">{price}</div>
          <div className="flex items-center gap-3">
            <a href="">
              <FavoriteBorderIcon className="hover:text-[#00b7c0] transition-colors ease-in-out duration-500" />
            </a>
            <a href="">
              <ShoppingCartOutlinedIcon className="hover:text-[#00b7c0] transition-colors ease-in-out duration-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
