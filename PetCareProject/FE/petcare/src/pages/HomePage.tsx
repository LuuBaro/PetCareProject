import React from "react";
import Header from "../components/header/Header";
import Slider from "../components/slider/Slider";
import SelectItem from "../components/SelectItem/SelectItem";
import TopSeller from "../components/product/TopSeller";
import Catagory from "../components/catagory/Catagory";
import Artical from "../components/artical/Artical";
import TopProduct from "../components/product/TopProduct";
import DogProduct from "../components/product/DogProduct";
import CatProduct from "../components/product/CatProduct";
import Policy from "../components/policy/Policy";
import Footer from "../components/footer/Footer";

const HomePage = () => {
  return (
    <>
      <Header></Header>
      <Slider></Slider>
      <SelectItem></SelectItem>
      <Catagory></Catagory>
      <TopSeller></TopSeller>
      <TopProduct></TopProduct>
      <DogProduct></DogProduct>
      <CatProduct></CatProduct>
      <Artical></Artical>
      <Policy></Policy>
      <Footer></Footer>
    </>
  );
};

export default HomePage;



