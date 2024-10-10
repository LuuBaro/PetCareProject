import React from "react";
import { useEffect, useState } from "react";
import Item from "./Item";
import "/src/App.css";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

export default function Catagory() {
  const items = [
    { name: "Thức ăn chó", image: "/src/assets/a1.png" },
    { name: "Thức ăn mèo", image: "/src/assets/a2.png" },
    { name: "Bát ăn thú cưng", image: "/src/assets/a3.png" },
    { name: "Vòng cổ dây dắt", image: "/src/assets/a4.png" },
    { name: "Thuốc và dinh dưỡng", image: "/src/assets/a5.png" },
    { name: "Sửa tắm & dụng cụ vệ sinh", image: "/src/assets/a6.png" },
    { name: "Chuồng, nệm & túi", image: "/src/assets/a7.png" },
    { name: "Chậu & cát vệ sinh", image: "/src/assets/a8.png" },
    { name: "Đồ chơi thú cưng", image: "/src/assets/a9.png" },
    { name: "Thời trang thú cưng", image: "/src/assets/a10.png" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const itemsPerPage = 6;

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      return newIndex;
    });
  };
  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, items.length - itemsPerPage);
      return newIndex;
    });
  };
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex =
            prevIndex === items.length - itemsPerPage
              ? items.length - itemsPerPage
              : prevIndex + 1;
          return newIndex;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, items.length, itemsPerPage]);
  useEffect(() => {
    if (!isAutoPlay) {
      const timeout = setTimeout(() => setIsAutoPlay(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isAutoPlay]);
  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative mx-32 mt-8 bg-white shadow">
      <div className="slider-wrapper">
        <div
          className="slider-container"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}>
          {items.map((item, index) => (
            <Item key={index} name={item.name} image={item.image} />
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2"
        onClick={prevSlide}>
        <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 30 }} className="text-[#00B7C0] text-3xl" />
      </button>

      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2"
        onClick={nextSlide}>
        <ArrowForwardIosOutlinedIcon sx={{ fontSize: 30 }} className="text-[#00B7C0]" />
      </button>
    </div>
  );
}
