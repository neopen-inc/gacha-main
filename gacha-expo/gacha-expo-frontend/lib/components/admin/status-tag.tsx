
interface StatusTagProps {
  status: string;
}
export function StatusTag({ status }: StatusTagProps) {
  return status === 'active' ? <span className="px-2 py-1 rounded text-xs text-white bg-green-500">{status}</span>
    : status === 'suspended' ? <span className="px-2 py-1 rounded text-xs text-white bg-red-500">{status}</span>
      : <span className="px-2 py-1 rounded text-xs text-white bg-yellow-500">{status}</span>
}