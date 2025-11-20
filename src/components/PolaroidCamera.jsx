import Countdown from "./Countdown"; // 導入倒數元件
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

export default function PolaroidCamera({ labelText = "南門市場 到此一遊", canvasWidth = 900, canvasHeight = 1100 }) {
  const webcamRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);

  const framePadding = 18;
  const bottomBand = Math.round(canvasHeight * 0.18);

  const capture = async () => {
    const polaroid = document.getElementById("polaroidFrame");
    if (!polaroid) return;

    const canvas = await html2canvas(polaroid, { useCORS: true, scale: 2 });
    setPhotoSrc(canvas.toDataURL("image/png"));
  };

  const startCountdownAndCapture = () => {
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    capture();
  };

  const retake = () => setPhotoSrc(null);
  const downloadPolaroid = () => {
    if (!photoSrc) return;
    const link = document.createElement("a");
    link.href = photoSrc;
    link.download = "nanmen-polaroid.png";
    link.click();
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/present3.jpg')" }}>
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="relative z-10 text-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          南門市場的現在，就在眼前。<br />
          拿起拍立得，記錄屬於你的瞬間！
        </h2>
      </div>

      <div id="polaroidFrame" className="relative bg-white rounded-xl shadow-2xl flex flex-col items-center justify-start overflow-hidden" style={{ width: canvasWidth / 3 + "px", height: canvasHeight / 3 + "px", padding: framePadding / 3 + "px" }}>
        {!photoSrc ? (
          <Webcam ref={webcamRef} audio={false} screenshotFormat="image/png" className="w-full h-full object-cover" videoConstraints={{ facingMode: "user", aspectRatio: canvasWidth / canvasHeight }} />
        ) : (
          <img src={photoSrc} alt="polaroid" className="w-full h-full object-cover" />
        )}

        {/* 拍立得底部白邊 */}
        <div className="absolute bottom-0 left-0 w-full bg-white flex items-center justify-center" style={{ height: bottomBand / 3 + "px", fontFamily: '"ZCOOL QingKe HuangYou", "Noto Sans TC", sans-serif', fontSize: (bottomBand * 0.28) / 3 + "px", fontWeight: 900, color: "#444" }}>
          {labelText}
        </div>

        {/* Logo */}
        <img src="/images/marketlogo.png" alt="logo" className="absolute" style={{ width: (bottomBand * 0.6) / 3 + "px", height: (bottomBand * 0.6) / 3 + "px", bottom: "10px", right: "10px" }} />
      </div>

      {/* 倒數元件 */}
      {showCountdown && (
  <Countdown
    start={3}
    onComplete={handleCountdownComplete}
    shutterAudioSrc="/sounds/shutter-snap.mp3"
  />
)}


      {/* 拍照 / 重拍 / 下載 按鈕 */}
      <div className="flex gap-4 mt-6 z-10">
        {!photoSrc ? (
          <button onClick={startCountdownAndCapture} className="px-6 py-2 rounded-xl bg-emerald-600 text-black">
            📷 拍照
          </button>
        ) : (
          <>
            <button onClick={retake} className="px-4 py-2 rounded-lg bg-gray-300">
              重拍
            </button>
            <button onClick={downloadPolaroid} className="px-4 py-2 rounded-lg bg-emerald-600 text-black">
              下載
            </button>
          </>
        )}
      </div>
    </div>
  );
}


