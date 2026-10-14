import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: 'NEW TO ALO? DISCOVER ICONIC DROPS',
    title: 'STUDIO TO STREET LUXURY',
    description: 'Sculpting Airlift fabrics, plush Accolade fleece, and conscious high-fashion silhouettes.',
    ctaTextPrimary: 'SHOP WOMEN',
    categoryPrimary: 'women',
    ctaTextSecondary: 'SHOP MEN',
    categorySecondary: 'men',
    bgImage: 'https://www.aloyoga.com/cdn/shop/files/DESKTOP_NO_CTA_9_27605304-ccb9-448b-b0d7-9c70b7a9f2ea_2048x2048.progressive.jpg'
  },
  {
    id: 2,
    subtitle: 'LIMITED EDITION SHADE',
    title: 'THE RICH BORDEAUX & BAMBOO TRAIL DROP',
    description: 'Deep intoxicating wine hues infused across sculpting activewear and luxury puffer outerwear.',
    ctaTextPrimary: 'EXPLORE THE DROP',
    categoryPrimary: 'women',
    ctaTextSecondary: 'SHOP JACKETS',
    categorySecondary: 'new-arrivals',
    bgImage: 'https://www.aloyoga.com/cdn/shop/files/MOBILE__10.17___Rich_Bordeaux_WK1___Outerwear_1_2048x2048.progressive.jpg'
  },
  {
    id: 3,
    subtitle: 'PRO STUDIO GEAR',
    title: 'WARRIOR YOGA MATS & ACCESSORIES',
    description: 'Pro-grade dry grip cushion mats, caps, socks, and studio lifestyle gear.',
    ctaTextPrimary: 'SHOP ACCESSORIES',
    categoryPrimary: 'accessories',
    ctaTextSecondary: 'VIEW ALL',
    categorySecondary: 'all',
    bgImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1800&auto=format&fit=crop'
  }
];

export default function HeroBanner({ onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="hero-container">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`hero-slide-bg ${idx === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.bgImage})` }}
        />
      ))}
      <div className="hero-overlay"></div>

      {/* Navigation Arrows */}
      <button
        className="hero-arrow hero-arrow-left"
        aria-label="Previous Slide"
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
      >
        <ChevronLeft size={24} color="#FFF" />
      </button>

      <button
        className="hero-arrow hero-arrow-right"
        aria-label="Next Slide"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
      >
        <ChevronRight size={24} color="#FFF" />
      </button>

      {/* Slide Content */}
      <div className="hero-content" key={slide.id}>
        <p className="hero-subtitle">{slide.subtitle}</p>
        <h1 className="hero-title">{slide.title}</h1>
        <p className="font-serif hero-desc">
          {slide.description}
        </p>

        <div className="hero-cta-group">
          <button
            className="btn-primary"
            onClick={() => onSelectCategory(slide.categoryPrimary)}
          >
            {slide.ctaTextPrimary} <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary"
            onClick={() => onSelectCategory(slide.categorySecondary)}
          >
            {slide.ctaTextSecondary}
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
