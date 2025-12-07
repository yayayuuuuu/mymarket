import Countdown from "./Countdown";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import MagicToast from "./MagicToast";

export default function PolaroidCamera({ labelText = "南門市場 記憶錨點", canvasWidth = 900, canvasHeight = 1100 }) {
  const webcamRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [videoConstraints, setVideoConstraints] = useState({ facingMode: "user" });

  const framePadding = 18;
  const bottomBand = Math.round(canvasHeight * 0.18);

  useEffect(() => {
    async function getVideoStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        setVideoConstraints({
          facingMode: "user",
          width: settings.width,
          height: settings.height
        });
        track.stop();
      } catch (err) {
        console.warn("無法取得前鏡頭設定：", err);
      }
    }
    getVideoStream();
  }, []);

  const capture = async () => {
    const polaroid = document.getElementById("polaroidFrame");
    if (!polaroid) return;
    const canvas = await html2canvas(polaroid, { useCORS: true, scale: 2 });
    setPhotoSrc(canvas.toDataURL("image/png"));
  };

  const handleDownload = () => {
    if (!photoSrc) return;

    const link = document.createElement("a");
    link.href = photoSrc;
    link.download = "nanmen-polaroid.png";
    link.click();

    // 顯示魔法提示
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/present3.jpg')" }}>
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

     <div className="relative z-10 text-center mb-6">
  <h2
    className="
      text-white text-outline font-bold leading-relaxed
      text-lg sm:text-xl md:text-2xl lg:text-3xl
    "
  >
    南門市場的現在，就在眼前。<br />
    拿起拍立得，擷取屬於你的瞬間！
  </h2>
</div>


      {/* 拍立得框 */}
      <div
        id="polaroidFrame"
        className="relative bg-white rounded-xl shadow-2xl flex flex-col items-center justify-start overflow-hidden"
        style={{
          width: canvasWidth / 3 + "px",
          height: canvasHeight / 3 + "px",
          padding: framePadding / 3 + "px"
        }}
      >
        <div className="flex items-center justify-center w-full h-full overflow-hidden">
          {!photoSrc ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <img src={photoSrc} className="max-w-full max-h-full object-contain" />
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 w-full bg-white flex items-center justify-center"
          style={{
            height: bottomBand / 3 + "px",
            fontFamily: '"ZCOOL QingKe HuangYou", "Noto Sans TC", sans-serif',
            fontSize: (bottomBand * 0.28) / 3 + "px",
            fontWeight: 900,
            color: "#444"
          }}
        >
          {labelText}
        </div>

        <img
          src="/images/marketlogo.png"
          className="absolute"
          style={{
            width: (bottomBand * 0.6) / 3 + "px",
            bottom: "10px",
            right: "10px"
          }}
        />
      </div>

      {showCountdown && <Countdown start={3} onComplete={() => { setShowCountdown(false); capture(); }} />}

      <div className="flex gap-4 mt-6 z-10 flex-wrap justify-center">
  {!photoSrc ? (
    <button
      onClick={() => setShowCountdown(true)}
      className="px-4 py-2 rounded-lg bg-gray-100 text-sm sm:text-base md:text-lg lg:text-xl"
    >
      開始擷取固著影像
    </button>
  ) : (
    <>
      <button
        onClick={() => setPhotoSrc(null)}
        className="px-4 py-2 rounded-lg bg-gray-100 text-sm sm:text-base md:text-lg lg:text-xl"
      >
        重拍
      </button>
      <button
        onClick={handleDownload}
        className="px-4 py-2 rounded-lg bg-gray-100 text-sm sm:text-base md:text-lg lg:text-xl"
      >
        下載
      </button>
    </>
  )}
</div>


      {/* 魔法提示 */}
      <MagicToast message="✨ 恭喜，時空固著程度+1！" visible={toastVisible} />
    </div>
  );
}



