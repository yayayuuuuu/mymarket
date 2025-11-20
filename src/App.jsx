import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import IntroPage from "./components/IntroPage";
import Home from "./pages/Home";
import PastUniverse from "./pages/PastUniverse";
import PresentUniverse from "./pages/PresentUniverse";
import FutureUniverse from "./pages/FutureUniverse";
import Gallery from "./pages/Gallery";

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <Router>
      {/* 首頁，不放在 Routes 裡 */}
      {!entered && <IntroPage onEnter={() => setEntered(true)} />}

      {/* 主內容與路由 */}
      {entered && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/past" element={<PastUniverse />} />
          <Route path="/present" element={<PresentUniverse />} />
          <Route path="/future" element={<FutureUniverse />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      )}
    </Router>
  );
}



