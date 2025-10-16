import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const images = [
  {
    url: 'https://th.bing.com/th/id/OIP.jUfCu2A6ilKJAdybISEMgwHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    caption: 'Delicious meals delivered fast\nOrder now and enjoy at home'
  },
  {
    url: 'https://th.bing.com/th/id/OIP.ocoRkFpt4KG6E2SnI-mDbQHaE7?w=306&h=204&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    caption: 'Fresh ingredients, amazing taste\nOnly at your local favorites'
  },
  {
    url: 'https://th.bing.com/th/id/OIP.hJ_OQpbbocvcGM11P2PvKQHaLG?w=204&h=306&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    caption: 'Try something new today\nExciting cuisines await!'
  },
  {
    url: 'https://th.bing.com/th/id/OIP.2B7eY4ej8pE5ISsulIhEeAHaLH?w=204&h=306&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    caption: 'Fast, fresh, and tasty\nDelivered with love'
  }
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, 5000);

  return () => clearInterval(interval);
}, []);


  return (
    <div className="slider">
      <FaArrowLeft className="left-arrow" onClick={prevSlide} />
      <FaArrowRight className="right-arrow" onClick={nextSlide} />

      <div className="slides-container" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((img, index) => (
          <div className="slide" key={index}>
            <img src={img.url} alt={`Slide ${index}`} className="image" />
            <div className="caption">
              {img.caption.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? 'active-dot' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
