import Countdown from "./Countdown";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

export default function PolaroidCamera({ labelText = "南門市場 到此一遊", canvasWidth = 900, canvasHeight = 1100 }) {
  const webcamRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [videoConstraints, setVideoConstraints] = useState({ facingMode: "user" });

  const framePadding = 18;
  const bottomBand = Math.round(canvasHeight * 0.18);

  // 取得前鏡頭比例
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
        track.stop(); // 先關掉 track
      } catch (err) {
        console.warn("無法取得前鏡頭設定，使用預設", err);
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

  const startCountdownAndCapture = () => setShowCountdown(true);
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
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="relative z-10 text-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          南門市場的現在，就在眼前。<br />
          拿起拍立得，記錄屬於你的瞬間！
        </h2>
      </div>

      {/* 拍立得框 */}
      <div id="polaroidFrame" className="relative bg-white rounded-xl shadow-2xl flex flex-col items-center justify-start overflow-hidden" style={{ width: canvasWidth / 3 + "px", height: canvasHeight / 3 + "px", padding: framePadding / 3 + "px" }}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {!photoSrc ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <img src={photoSrc} alt="polaroid" className="max-w-full max-h-full object-contain" />
          )}
        </div>

        {/* 拍立得底部白邊 */}
        <div className="absolute bottom-0 left-0 w-full bg-white flex items-center justify-center" style={{ height: bottomBand / 3 + "px", fontFamily: '"ZCOOL QingKe HuangYou", "Noto Sans TC", sans-serif', fontSize: (bottomBand * 0.28) / 3 + "px", fontWeight: 900, color: "#444" }}>
          {labelText}
        </div>

        {/* Logo */}
        <img src="/images/marketlogo.png" alt="logo" className="absolute" style={{ width: (bottomBand * 0.6) / 3 + "px", height: (bottomBand * 0.6) / 3 + "px", bottom: "10px", right: "10px" }} />
      </div>

      {showCountdown && <Countdown start={3} onComplete={handleCountdownComplete} />}

      <div className="flex gap-4 mt-6 z-10">
        {!photoSrc ? (
          <button onClick={startCountdownAndCapture} className="px-6 py-2 rounded-xl bg-emerald-600 text-black">採集固著影像</button>
        ) : (
          <>
            <button onClick={retake} className="px-4 py-2 rounded-lg bg-gray-300">重拍</button>
            <button onClick={downloadPolaroid} className="px-4 py-2 rounded-lg bg-gray-300 text-black">下載</button>
          </>
        )}
      </div>
    </div>
  );
}


