import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

export default function ImageSlider() {
  const images = ["/src/assets/slider2.png", "/src/assets/slider3.png"];

  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className="relative mx-32 h-[50%] mt-5 border rounded-xl overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {images.map((image, index) => (
          <div key={index} className="flex justify-center">
            <img
              className="rounded-xl w-full flex-shrink-0"
              src={image}
              alt={`slider-${index}`}
            />
          </div>
        ))}
      </Slider>
      <button
        onClick={prevSlide}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 hover:text-[#00b7c0]">
        <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "45px" }} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:text-[#00b7c0]">
        <ArrowForwardIosOutlinedIcon sx={{ fontSize: "45px" }} />
      </button>
    </div>
  );
}
