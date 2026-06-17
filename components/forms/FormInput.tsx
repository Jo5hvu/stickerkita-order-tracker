type FormInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  step?: string;
  min?: string;
};

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  step,
  min,
}: FormInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-900">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        step={step}
        min={min}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
      />
    </label>
  );
}