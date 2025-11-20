// components/FixedBackButton.jsx
import { createPortal } from "react-dom";

export default function FixedBackButton({ onClick }) {
  return createPortal(
    <button
      onClick={onClick}
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
    </button>,
    document.body
  );
}

