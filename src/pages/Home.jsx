import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const audioRef = useRef(null); // 🔊 音效 ref

  const sections = [
    {
      title: "前人固著紀錄",
      description: "殘存於時空裂縫中的歷史碎片",
      color: "from-yellow-300 to-orange-400",
      link: "/past",
      type: "past",
      images: ["/images/past1.jpg", "/images/past2.jpg", "/images/past3.jpg"],
    },
    {
      title: "實地影像校準",
      description: "採集固著影像新增時空錨定度",
      color: "from-green-300 to-emerald-500",
      link: "/present",
      type: "present",
      images: [
        "/images/present1.png",
        "/images/present2.jpg",
        "/images/present3.jpg",
        "/images/present4.png",
      ],
    },
    {
      title: "未來錨點創造",
      description: "時空維度發展與未來藍圖繪製",
      color: "from-blue-400 to-purple-600",
      link: "/future",
      type: "falling",
    },
  ];

  // ------------------- 點擊跳轉 + 音效 -------------------
  const handleClick = (link) => {
    setTransitioning(true);

    // 播放音效
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log(err));
    }

    setTimeout(() => navigate(link), 1500); // 過場動畫時間
  };

  // ------------------- 滾動到指定 section -------------------
  useEffect(() => {
    if (location.state?.scrollTo) {
      const index = sections.findIndex((s) => s.link === location.state.scrollTo);
      if (index !== -1 && sectionRefs.current[index]) {
        sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state]);

  // ------------------- 偵測當前 section -------------------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / window.innerWidth);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-x-auto overflow-y-hidden">
      {/* 音效 */}
      <audio ref={audioRef} src="/sounds/transition.mp3" />

      {/* 橫向滑動容器 */}
      <div
        ref={containerRef}
        className="flex h-screen snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {sections.map((section, i) => (
          <div
            key={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="flex-shrink-0 w-screen h-screen snap-start cursor-pointer relative"
            onClick={() => handleClick(section.link)}
          >
            {/* 左右陰影 */}
            <div
              className={`absolute top-0 left-0 w-24 h-full pointer-events-none bg-gradient-to-r from-black/30 to-transparent transition-opacity duration-300 ${
                i === activeIndex ? "opacity-50" : "opacity-0"
              }`}
            ></div>
            <div
              className={`absolute top-0 right-0 w-24 h-full pointer-events-none bg-gradient-to-l from-black/30 to-transparent transition-opacity duration-300 ${
                i === activeIndex ? "opacity-50" : "opacity-0"
              }`}
            ></div>

            <UniverseSection section={section} isActive={i === activeIndex} />
          </div>
        ))}
      </div>

      {/* 固定底部滑動提示 */}
      <div className="neon-text left-1/2 transform -translate-x-1/2">
        <p>滑動探索 →</p>
        <p>(點擊進入該宇宙)</p>
      </div>

      {/* 過場動畫 */}
      {transitioning && (
        <div className="absolute inset-0 z-50 overflow-hidden bg-black flex items-center justify-center">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="flowing-line"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 1 + 0.8}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            ></div>
          ))}

          <style>{`
            @keyframes slideDown {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            .flowing-line {
              position: absolute;
              width: 2px;
              height: 100%;
              background: white;
              opacity: 0.2;
              animation-name: slideDown;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
// ---------------------------- UniverseSection ----------------------------
function UniverseSection({ section, isActive }) {
  const sliderRef = useRef(null);

  useEffect(() => {
    if (section.type === "past") {
      const slider = sliderRef.current;
      const imgs = [...section.images, ...section.images];
      if (slider) {
        const scroll = slider.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
          { duration: imgs.length * 8000, iterations: Infinity, easing: "linear" }
        );
        return () => scroll.cancel();
      }
    }

    if (section.type === "falling") {
      const container = sliderRef.current;
      const createMark = () => {
        const mark = document.createElement("div");
        mark.innerText = "?";
        mark.className = "absolute text-white";
        mark.style.left = `${Math.random() * 100}%`;
        mark.style.top = `-2rem`;
        mark.style.opacity = Math.random() * 0.7 + 0.3;
        mark.style.fontSize = `${Math.random() * 24 + 36}px`;
        container.appendChild(mark);
        mark
          .animate(
            [{ transform: "translateY(0)" }, { transform: `translateY(${window.innerHeight}px)` }],
            { duration: Math.random() * 2000 + 3500, easing: "linear" }
          )
          .onfinish = () => mark.remove();
      };
      const interval = setInterval(createMark, 200);
      return () => clearInterval(interval);
    }
  }, [section]);

  if (section.type === "past") {
    const imgs = [...section.images, ...section.images];
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
        <div ref={sliderRef} className="absolute inset-0 flex" style={{ width: `${imgs.length * 100}vw` }}>
          {imgs.map((img, i) => (
            <div
              key={i}
              className="h-full w-screen bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-[url('/grain.png')] opacity-20 mix-blend-overlay"></div>
        <div
          className={`relative z-10 text-center px-6 py-4 bg-black/30 backdrop-blur-md rounded-xl transition-transform duration-500 ease-out transform ${
            isActive ? "scale-100 opacity-100" : "scale-[1.02] opacity-70"
          }`}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">{section.title}</h1>
          <p className="text-sm opacity-90 text-white">{section.description}</p>
        </div>
      </div>
    );
  }

  if (section.type === "present") {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-emerald-500 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <div className="grid grid-cols-2 gap-3 animate-slowZoom p-6">
            {section.images.map((img, i) => (
              <div
                key={i}
                className="w-40 h-40 bg-cover bg-center rounded-xl shadow-lg"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div
          className={`relative z-10 text-center px-6 py-4 bg-white/20 backdrop-blur-md rounded-xl transition-transform duration-500 ease-out transform ${
            isActive ? "scale-100 opacity-100" : "scale-[1.02] opacity-70"
          }`}
        >
          <h1 className="text-4xl font-bold mb-2 text-white">{section.title}</h1>
          <p className="text-sm opacity-90 text-white">{section.description}</p>
        </div>
      </div>
    );
  }

  // 未來宇宙
  return (
    <div className={`relative w-screen h-screen flex items-center justify-center bg-gradient-to-br ${section.color} overflow-hidden`}>
      <div ref={sliderRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div
        className={`relative z-10 text-center transition-transform duration-500 ease-out transform ${
          isActive ? "scale-100 opacity-100" : "scale-[1.02] opacity-70"
        }`}
      >
        <h1 className="text-4xl mb-2">{section.title}</h1>
        <p className="text-sm opacity-90">{section.description}</p>
      </div>
    </div>
  );
}


