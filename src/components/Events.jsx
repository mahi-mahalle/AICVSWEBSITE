import React, { useState, useEffect, useRef, useCallback } from "react";
import Section from "./Section";
import Header from "./Header";
import Footer from "./Footer";
import { smallSphere, stars } from "../assets";
import Heading from "./Heading";
import EventList from "./EventList";
import { LeftLine, RightLine } from "./design/Pricing";
import BackgroundLayout from "./BackgroundLayout";

const synapsePhotos = [
  { id: 1, src: "/images/Event_img/img1.jpeg", caption: "Opening Ceremony" },
  { id: 2, src: "/images/Event_img/img2.jpeg", caption: "Workshop Day" },
  { id: 3, src: "/images/Event_img/img3.jpeg", caption: "Panel Discussion" },
  // Adding placeholders for the rest to keep the carousel full
  { id: 4, src: "/images/Event_img/img1.jpeg", caption: "Team Building" },
  { id: 5, src: "/images/Event_img/img2.jpeg", caption: "Award Night" },
  { id: 6, src: "/images/Event_img/img3.jpeg", caption: "Closing Ceremony" },
];

const SprocketRow = ({ count = 18 }) => (
  <div
    style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-around",
      padding:        "5px 12px",
      background:     "#111",
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          width:        "14px",
          height:       "10px",
          borderRadius: "3px",
          background:   "#000",
          border:       "1px solid #333",
          flexShrink:   0,
        }}
      />
    ))}
  </div>
);

const FilmStripCarousel3D = () => {
  const total = synapsePhotos.length;
  const [offset, setOffset] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    const diff = targetRef.current - currentRef.current;
    if (Math.abs(diff) > 0.0001) {
      currentRef.current += diff * 0.08;
      setOffset(currentRef.current);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const interval = setInterval(() => {
      targetRef.current += 1;
    }, 2000);                         
    return () => clearInterval(interval);
  }, []);

  const goNext = () => { targetRef.current += 1; };
  const goPrev = () => { targetRef.current -= 1; };

  const getFrameStyle = (slotOffset) => {
    const absOffset = Math.abs(slotOffset);
    const xMove = slotOffset * 400;
    const rotateY = slotOffset * -20;
    const zMove = absOffset * -200;
    const scale = 1.25 - absOffset * 0.4;
    const opacity = Math.max(0, 1 - absOffset * 0.4);

    return {
      transform: `translateX(${xMove}px) translateZ(${zMove}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 100 - Math.abs(Math.round(slotOffset * 10)),
    };
  };

  const slots = Array.from({ length: 7 }, (_, i) => i - 3);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "600px", marginTop: "20px" }}
    
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
      >
        {slots.map((slot) => {
          const fractional = currentRef.current - Math.round(currentRef.current);
          const slotOffset = slot - fractional;
          const photoIndex = ((Math.round(currentRef.current) + slot) % total + total) % total;
          const photo = synapsePhotos[photoIndex];
          const isCenter = Math.abs(slotOffset) < 0.1;
          const style = getFrameStyle(slotOffset);

          return (
            <div
              key={`${photoIndex}-${slot}`}
              onClick={() => {
                if (slot > 0) goNext();
                else if (slot < 0) goPrev();
              }}
              className="absolute transition-opacity duration-300"
              style={{
                width: "420px",
                height: "280px",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                ...style,
              }}
            >
              <div className={`relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-500 
                ${isCenter ? 'shadow-2xl border-white/40 scale-100' : 'border-white/10 opacity-60'}`}>
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className={`text-white text-3xl font-black uppercase tracking-tighter transition-all duration-500 
                    ${isCenter ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {photo.caption.split(' ')[0]}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        <button
          onClick={goPrev}
          className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 transition-all rounded-full text-white"
        >
          ←
        </button>
        <button
          onClick={goNext}
          className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 transition-all rounded-full text-white"
        >
          →
        </button>
      </div>
    </div>
  );
};

// ─── Page ───────────────────────────────────────────────────────────────────
const Events = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <BackgroundLayout />
      </div>

      <div>
        <Header />

        <Section className="overflow-hidden" id="pricing">
          <div className="container relative z-2">

            <h1
              className="text-center text-4xl md:text-6xl font-extrabold mb-4 mt-16 
                bg-gradient-to-r from-purple-300 via-purple-500 to-purple-700
                text-transparent bg-clip-text tracking-wide uppercase"
            >
              EVENTS
            </h1>
            <p className="text-center text-lg md:text-2xl font-medium text-purple-200">
              Dive into every event organized by AICVS — tech sessions, workshops, hackathons, and more.
            </p>

            <FilmStripCarousel3D />

            <div className="relative">
              <EventList />
              <LeftLine />
              <RightLine />
            </div>
          </div>
        </Section>

        <Footer />
      </div>
    </>
  );
};

export default Events;
