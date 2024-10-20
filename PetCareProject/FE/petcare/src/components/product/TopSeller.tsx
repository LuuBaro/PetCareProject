import React from "react";
import ItemSeller from "./ItemSeller";
import FlashSale from "../flashSale/FlashSale";

const items = [
  {
    name: "Dầu gọi cho mèo",
    image: "/src/assets/product8.jpg",
    price: "199.000đ",
  },
  {
    name: "Bát ăn cho mèo",
    image: "/src/assets/product2.jpg",
    price: "150.000đ",
  },
  {
    name: "Bát ăn cho mèo",
    image: "/src/assets/product4.jpg",
    price: "100.000đ",
  },
  {
    name: "Sữa tắm cho chó",
    image: "/src/assets/product7.jpg",
    price: "250.000đ",
  },
];

export default function TopSeller() {
  return (
    <div>
      <span className="block mx-32 text-3xl pt-10 font-semibold">
        Giảm giá mỗi ngày
      </span>
      <FlashSale/>
      <div className="grid grid-cols-4 gap-6 mx-32 mb-10 mt-3">
        {items.map((item, index) => (
          <ItemSeller
            key={index}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}
