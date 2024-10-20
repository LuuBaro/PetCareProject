import React from "react";
import Slider from "react-slick";
import ProductItem from "./ProductItem";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
const products = [
  {
    id: 1,
    name: "Hạt dành cho chó",
    price: "1.999.000đ",
    image: "/src/assets/product8.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Hạt dành cho chó",
    price: "1.999.000đ",
    image: "/src/assets/product3.jpg",
    rating: 1,
  },
  {
    id: 3,
    name: "Bát ăn cho mèo",
    price: "2.500.000đ",
    image: "/src/assets/product6.jpg",
    rating: 3,
  },
  {
    id: 4,
    name: "Hạt dành cho mèo",
    price: "1.800.000đ",
    image: "/src/assets/product7.jpg",
    rating: 2,
  },
  {
    id: 5,
    name: "Bát ăn thú cưng",
    price: "3.200.000đ",
    image: "/src/assets/product2.jpg",
    rating: 4,
  },
  {
    id: 6,
    name: "Túi pate cho mèo",
    price: "2.100.000đ",
    image: "/src/assets/product5.jpg",
    rating: 5,
  },
];

export default function DogProduct() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const sliderRef = React.useRef(null);
  const next = () => {
    sliderRef.current.slickNext();
  };
  const prev = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <>
      <span className="block mx-32 text-3xl py-4 font-semibold">
        Sản phẩm cho cún
      </span>
      <div className="mx-32 mb-10 gap-5 relative">
        <Slider ref={sliderRef} {...settings}>
          {products.map((product) => (
            <ProductItem
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
            />
          ))}
        </Slider>
        <button
          onClick={prev}
          className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 hover:text-[#00b7c0]">
          <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "30px" }} />
        </button>
        <button
          onClick={next}
          className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 hover:text-[#00b7c0]">
          <ArrowForwardIosOutlinedIcon sx={{ fontSize: "30px" }} />
        </button>
      </div>
    </>
  );
}
