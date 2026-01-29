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
import RecentProducts from "../components/RecentProducts";
import TopRatedProducts from "../components/TopRatedProducts";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="fade show">
        <HeroCarousel />
      </div>
      <div className="fade show">
        <Features />
      </div>
      <div className="fade show">
        <ProductSection title="Flash Deals" />
      </div>
      <div className="fade show">
        <ProductSection title="Most Viewed Products" />
      </div>
      <div className="fade show">
        <PromoBanners />
      </div>
      <div className="fade show">
        <CategoryCarousel />
      </div>
      <div className="fade show">
        <ProductSection title="Best Sellers on Electronics" />
      </div>
      <div className="fade show">
        <RecentProducts />
      </div>
      <div className="fade show">
        <TopRatedProducts />
      </div>
      <div className="fade show">
        <BrandCarousel />
      </div>
      <div className="fade show">
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
