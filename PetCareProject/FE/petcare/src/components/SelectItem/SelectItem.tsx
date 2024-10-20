import React from "react";
import SelectItemCard from "./SelectItemCard";

const items = [
  {
    title: "Đăng nhập",
    description: "Đăng nhập vào hệ thống để mua hàng",
    bgColor: "#FF6C7F",
    image: "/src/assets/pet.png",
  },
  {
    title: "Cửa hàng",
    description: "Khám phá các sản phẩm của chúng tôi",
    bgColor: "#feda46",
    image: "/src/assets/store.png",
  },
  {
    title: "Spa thú y",
    description: "Đặt lịch hẹn chăm sóc thú cưng của bạn",
    bgColor: "#00c274",
    image: "/src/assets/booking.png",
  },
  {
    title: "Thăm Khám",
    description: "Chăm sóc sức khỏe thú cưng của bạn",
    bgColor: "#6cd9f7",
    image: "/src/assets/heart.png",
  },
];

export default function SelectItem() {
  return (
    <div className="grid grid-cols-4 gap-6 mx-32 py-1 m-5 h-28">
      {items.map((item, index) => (
        <SelectItemCard
          key={index}
          title={item.title}
          description={item.description}
          bgColor={item.bgColor}
          image={item.image}
        />
      ))}
    </div>
  );
}
