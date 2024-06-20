
interface FormInputProps {
  required?: boolean;
  type: string;
  name: string;
}

export function FormInput({ required, type, name }: FormInputProps) {
  return type === 'textarea' ? <textarea className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
    name={name}
    required={required || false}
    rows={5}></textarea > : <input
    type={type}
    name={name}
    required={required || false}
    className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
  />
}