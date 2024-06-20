
interface FormLabelProps {
  htmlFor: string;
  label: string;
}

export function FormLabel({ htmlFor, label }: FormLabelProps) {
  return <label
    htmlFor={htmlFor}
    className="mb-3 block text-sm font-medium text-gray-700"
  >
    {label}
  </label>
}
