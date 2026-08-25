import { useEffect, useState } from "react";

// Simple auto-advancing photo carousel. No external library - just a
// flex track that shifts via CSS transform, driven by a timer that
// resets whenever the visitor manually changes slides.
function PhotoCarousel({ images, intervalMs = 4000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs, index]);

  function goTo(nextIndex) {
    setIndex((nextIndex + images.length) % images.length);
  }

  return (
    <div className="photo-carousel">
      <div className="photo-carousel__viewport">
        <div className="photo-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((image, i) => (
            <img key={image.src} src={image.src} alt={image.alt ?? ""} className="photo-carousel__slide" />
          ))}
        </div>

        <button
          type="button"
          className="photo-carousel__arrow photo-carousel__arrow--prev"
          onClick={() => goTo(index - 1)}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          type="button"
          className="photo-carousel__arrow photo-carousel__arrow--next"
          onClick={() => goTo(index + 1)}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      <div className="photo-carousel__dots">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            className={`photo-carousel__dot ${i === index ? "photo-carousel__dot--active" : ""}`.trim()}
            onClick={() => goTo(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;
