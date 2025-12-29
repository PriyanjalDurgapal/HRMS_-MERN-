export default function Button({ text, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        w-full py-3 rounded-lg 
        bg-gradient-to-r from-[#3d2c70] to-[#2b2360]
        text-white font-semibold
        shadow-lg shadow-black/40
        hover:from-[#4a3690] hover:to-[#352c80]
        active:scale-[0.98]
        transition-all duration-300
      "
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
