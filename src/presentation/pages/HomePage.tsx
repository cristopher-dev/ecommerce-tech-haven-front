import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import HeroCarousel from '../components/HeroCarousel';
import PromoBanners from '../components/PromoBanners';
import ProductSection from '../components/ProductSection';
import CategoryCarousel from '../components/CategoryCarousel';
import BrandCarousel from '../components/BrandCarousel';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import RecentProducts from '../components/RecentProducts';
import TopRatedProducts from '../components/TopRatedProducts';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <Header />

      <main role="main" className="home-main">
        <section className="fade show">
          <HeroCarousel />
        </section>

        <section className="fade show">
          <Features />
        </section>

        <section className="fade show">
          <ProductSection title={t('homePage.flashDeals')} />
        </section>

        <section className="fade show">
          <ProductSection title={t('homePage.mostViewed')} />
        </section>

        <section className="fade show">
          <PromoBanners />
        </section>

        <section className="fade show">
          <CategoryCarousel />
        </section>

        <section className="fade show">
          <ProductSection title={t('homePage.bestSellers')} />
        </section>

        <section className="fade show">
          <RecentProducts />
        </section>

        <section className="fade show">
          <TopRatedProducts />
        </section>

        <section className="fade show">
          <BrandCarousel />
        </section>

        <section className="fade show">
          <Newsletter />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
