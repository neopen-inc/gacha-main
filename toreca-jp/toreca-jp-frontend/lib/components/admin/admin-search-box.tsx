import { IconSearch } from "../icons/search";

interface AdminSearchBoxProps {
  label: string;
}
export function AdminSearchBox({ label }: AdminSearchBoxProps) {
  return <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <IconSearch />
              </span>
              <input
                name="search"
                type="search"
                className="
                  w-full
                  py-2
                  text-sm text-gray-900
                  rounded-md
                  pl-10
                  border border-gray-300
                  focus:outline-none focus:ring-gray-500 focus:ring-gray-500 focus:z-10
                "
                placeholder={label}
              />
            </div>
}