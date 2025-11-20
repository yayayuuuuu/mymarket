import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PolaroidCamera from "../components/PolaroidCamera";
import TransitionOverlay from "../components/TransitionOverlay";
import IntroModal from "../components/IntroModal"; // 新增導入

export default function PresentUniverse() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // 控制文字視窗

  const handleBack = () => {
    setTransitioning(true);
    setTimeout(() => {
      navigate("/", { state: { scrollTo: "/present" } });
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 5 5 12 12 19" />
        </svg>
      </button>

      {/* 主內容 */}
     {showIntro ? null : <PolaroidCamera />}

      {/* IntroModal */}
      <IntroModal visible={showIntro} onClose={() => setShowIntro(false)} />

      {/* TransitionOverlay */}
      {transitioning && <TransitionOverlay visible={transitioning} />}
    </>
  );
}


