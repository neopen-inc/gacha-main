'use client'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import _ from "lodash";


interface PaginationProps {
  total: number;
  count: number;
  offset: number;
  limit: number;
  onPage: (page: number, limit: number) => void;
}
export function Pagination({ total, offset, limit, count, onPage }: PaginationProps) {
  const firstPage = 1;
  const lastPage = Math.ceil(total / limit);
  const currentPage = Math.ceil((Number(offset) + 1) / limit);
  const previousPage = currentPage - 1
  const nextPage = currentPage + 1;
  const pagesToShow = _.sortBy(_.uniq([firstPage, lastPage, previousPage, currentPage, nextPage].filter(page => page >= firstPage && page <= lastPage)))
  return <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
    <div>
      <div className="text-sm text-gray-500">
        <span className="font-medium">{total}</span>件
        の
        <span className="font-medium">{Number(offset) + 1}</span>
        番目から
        <span className="font-medium">{Number(offset) + count}</span>
        までの結果
      </div>
    </div>
    <div>
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px cursor-pointer flex-row items-stretch" aria-label="Pagination">
        <a
          onClick={() => currentPage > firstPage && onPage(currentPage - 1, limit)}
          className="cursor-pointer relative inline-flex items-center px-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="w-5 h-5" />
        </a>
        {pagesToShow.map((page, index) => <span key={index}>
          {index > 0 && page > pagesToShow[index - 1] + 1 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700" >...</span>}

          <a
            onClick={() => currentPage !== page && onPage(page, limit)}
            aria-current="page"
            className={`
            ${currentPage === page ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'}
            z-10
            cursor-pointer
            border-indigo-500
            relative
            inline-flex
            items-center
            px-4
            py-2
            border
            text-sm
            font-medium
            `}>
            {page}
          </a>
        </span>)}
        <a
          onClick={() => lastPage > currentPage && onPage(currentPage + 1, limit)}
          className="
            relative
            cursor-pointer
            inline-flex
            items-center
            px-2
            py-1
            rounded-r-md
            border border-gray-300
            text-sm
            font-medium
            text-gray-500
            hover:bg-gray-50
          "
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="w-5 h-5" />
        </a>
      </nav>
    </div>
  </div >
}