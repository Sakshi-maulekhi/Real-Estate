import { useEffect, useState } from "react";

function Slider({ images = [] }) {
  const [imageIndex, setImageIndex] = useState(null);

  const openSlider = (index) => {
    if (!images.length) return;
    setImageIndex(index);
  };

  const closeSlider = () => {
    setImageIndex(null);
  };

  const changeSlide = (direction) => {
    if (imageIndex === null) return;

    if (direction === "left") {
      setImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else {
      setImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

 
  useEffect(() => {
    const handleKey = (e) => {
      if (imageIndex === null) return;

      if (e.key === "ArrowLeft") changeSlide("left");
      if (e.key === "ArrowRight") changeSlide("right");
      if (e.key === "Escape") closeSlider();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [imageIndex]);

  if (!images.length) return null;

  return (
    <div className="w-full h-[350px] sm:h-[280px] flex gap-5">

      
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999]">

          
          <button
            onClick={() => changeSlide("left")}
            className="absolute left-6 text-white text-4xl hover:scale-110 transition"
          >
            ❮
          </button>

          {/* IMAGE */}
          <img
            src={images[imageIndex]}
            alt=""
            className="max-w-[90%] max-h-[85%] object-contain rounded-xl shadow-2xl"
          />

          
          <button
            onClick={() => changeSlide("right")}
            className="absolute right-6 text-white text-4xl hover:scale-110 transition"
          >
            ❯
          </button>

          
          <button
            onClick={closeSlider}
            className="absolute top-6 right-8 text-white text-3xl hover:text-purple-400 transition"
          >
            ✕
          </button>
        </div>
      )}

   
      <div className="flex-[3] sm:flex-[2]">
        <img
          src={images[0]}
          alt=""
          onClick={() => openSlider(0)}
          className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition"
        />
      </div>

      
      <div className="flex-1 flex flex-col justify-between gap-5">
        {images.slice(1).map((image, index) => (
          <img
            key={index}
            src={image}
            alt=""
            onClick={() => openSlider(index + 1)}
            className="h-[100px] sm:h-[80px] w-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition"
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;