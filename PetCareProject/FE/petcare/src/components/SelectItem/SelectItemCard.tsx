import React from "react";
import { Link } from "react-router-dom";

export default function SelectItemCard({ title, description, bgColor, image }) {
  const linkTo =
    title === "Đăng nhập" || title === "Cửa hàng" ? "/home" : "/comingsoon";
  return (
    <Link
      to={linkTo}
      className="flex items-center justify-between rounded-lg p-5 hover:transform hover:scale-105 transition duration-300 ease-in-out"
      style={{ backgroundColor: bgColor }}>
      <div className="w-52">
        <span className="text-[21px] font-medium block pb-2">{title}</span>
        <p className="w-44 text-[14px] leading-4">{description}</p>
      </div>
      <div>
        <img src={image} className="w-[70px]" alt={title} />
      </div>
    </Link>
  );
}
