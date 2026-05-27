import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCarousel.css';

export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);

  if (!images.length) return (
    <div className="carousel-placeholder">No images available</div>
  );

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className="carousel">
      <div className="carousel-main">
        <img
          key={current}
          src={images[current]}
          alt={`Product image ${current + 1}`}
          className="carousel-img animate-fade-in"
        />
        {images.length > 1 && (
          <>
            <button className="carousel-arrow prev" onClick={prev} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button className="carousel-arrow next" onClick={next} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === current ? 'active' : ''}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="carousel-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`carousel-thumb ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
