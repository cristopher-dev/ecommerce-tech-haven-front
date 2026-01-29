import React from "react";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import PromoBanners from "../components/PromoBanners";
import ProductSection from "../components/ProductSection";
import CategoryCarousel from "../components/CategoryCarousel";
import BrandCarousel from "../components/BrandCarousel";
import Features from "../components/Features";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <HeroCarousel />
      <PromoBanners />
      <ProductSection title="Flash Deals" />
      <ProductSection title="Most Viewed Products" />
      <CategoryCarousel />
      <ProductSection title="Best Sellers on Electronics" />
      <BrandCarousel />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default HomePage;
