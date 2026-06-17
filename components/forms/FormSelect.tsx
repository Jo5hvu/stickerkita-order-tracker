type FormSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function FormSelect({
  label,
  value,
  options,
  onChange,
}: FormSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-900">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-400"
      >
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}