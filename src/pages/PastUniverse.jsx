import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TimelinePast from "../components/TimelinePast";
import TransitionOverlay from "../components/TransitionOverlay";
import DustParticles from "../components/DustParticles";

export default function PastUniverse() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const scrollContainerRef = useRef(null);

  const timelineData = [
    { year: "1932", title: "南門市場成立", desc: "南門市場於日治時期正式建立，成為台北城重要的民生補給據點，攤商以傳統手工交易方式為主，市場內充滿濃厚的庶民生活氣息。", img: "/images/line1932.png" },
    { year: "1960", title: "市場改建與擴張", desc: "隨城市快速發展，市場迎來大規模改建，增加更多攤位與室內空間，並引入更多品項，成為居民每天必逛的生活中心。", img: "/images/line1960.png" },
    { year: "1980", title: "傳統攤商黃金時期", desc: "八零年代的南門市場達到鼎盛，全台知名的南北貨、熟食與年菜都在此聚集，節慶時更可見滿滿排隊人龍。", img: "/images/line1980.png" },
    { year: "2000", title: "世代交替", desc: "新舊文化開始碰撞，第二代與第三代攤商逐漸接手，市場開始出現更乾淨明亮的陳列方式，同時保留傳統風味。", img: "/images/line2000.png" },
    { year: "2020", title: "市場搬遷與再生", desc: "因安全考量與都市更新，南門市場進行大搬遷，在新建築中重新出發，延續百年的味道與記憶。", img: "/images/line2020.png" },
  ];

  const handleBack = () => {
    setTransitioning(true);
    setTimeout(() => {
      navigate("/", { state: { scrollTo: "/past" } });
    }, 1500);
  };

  return (
  <>
    {/* 返回按鈕 */}
    <button
      onClick={handleBack}
      className="fixed top-4 left-4 z-50 w-16 h-16 flex items-center justify-center
                 bg-black bg-opacity-50 rounded-full shadow-lg hover:bg-opacity-80 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 5 5 12 12 19" />
      </svg>
    </button>

    {/* Timeline 滿版水平滑動容器 */}
    <div
      ref={scrollContainerRef}
      className="w-full h-screen relative overflow-x-auto flex justify-center items-center z-10 overflow-y-hidden"
    >
      {/* ⬇ 在 timeline 父層內插入 DustParticles（不再用 fixed） */}
      <DustParticles className="absolute top-0 left-0 w-full h-full z-0" />

      {/* 真正的 timeline 區域 */}
      <div className="relative w-max h-full flex justify-center items-center z-10">
        <TimelinePast timelineData={timelineData} scrollContainerRef={scrollContainerRef} />

        <TransitionOverlay visible={transitioning} />
      </div>
    </div>
  </>
);
}










