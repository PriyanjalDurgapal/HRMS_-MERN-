export default function Input({ placeholder, type, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full p-3 rounded-lg 
        bg-[#4B3E66] text-white
        placeholder-gray-300
        border border-transparent
        focus:border-purple-300 focus:ring-2 focus:ring-purple-400
        transition
      "
    />
  );
}
