import { useState, useEffect } from "react";

export default function Slider({ slides = [] }) {
  const [index, setIndex] = useState(0);

  if (!Array.isArray(slides) || slides.length === 0) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-lg font-medium">
        No slides available
      </div>
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  const current = slides[index] || slides[0];

  return (
    <div className="relative w-full h-full">
      <img
        src={current.image}
        alt={current.title || "slide"}
        className="w-full h-full object-cover rounded-l-2xl"
      />

      <div className="absolute top-4 left-4 flex justify-start w-full px-4">
        <img
          src="/PRIYANJAL CONSULTANCY.png"
          className="h-15 rounded-xl shadow-md"
          alt="Logo"
        />
        <button className="text-white bg-white/20 ml-80 px-4 py-1 rounded-full text-sm backdrop-blur-md">
          <a href="/">Back to website →</a>
        </button>
      </div>

      <div className="absolute bottom-10 left-10 text-white">
        <h2 className="text-2xl font-semibold">{current.title}</h2>
        <p className="opacity-90">{current.subtitle}</p>
      </div>

      <div className="absolute bottom-5 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-6 rounded-full transition-all duration-300 ${
              index === i ? "bg-white" : "bg-white/40"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}