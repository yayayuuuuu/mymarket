export default function PolaroidButton({ onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
