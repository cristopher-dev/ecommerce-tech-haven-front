import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        <ProductSection title={t("homePage.flashDeals")} />
      </div>
      <div className="fade show">
        <ProductSection title={t("homePage.mostViewed")} />
      </div>
      <div className="fade show">
        <PromoBanners />
      </div>
      <div className="fade show">
        <CategoryCarousel />
      </div>
      <div className="fade show">
        <ProductSection title={t("homePage.bestSellers")} />
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
