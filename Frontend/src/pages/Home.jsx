// File: src/pages/Home.jsx
import React from 'react';
import HeroSlider from '../features/Home/components/HeroSlider';
import AboutSection from '../features/Home/components/AboutSection';
import QualitySystem from '../features/Home/components/QualitySystem';
import ProductLine from '../features/Home/components/ProductLine';
import NewsEvents from '../features/Home/components/NewsEvents';

const Home = () => {
    return (
        <main>
            <HeroSlider />
            <div className="section-spacer"><div className="spacer-line"></div></div>
            <AboutSection />
            <QualitySystem />
            <ProductLine />
            <NewsEvents />
        </main>
    );
};

export default Home;