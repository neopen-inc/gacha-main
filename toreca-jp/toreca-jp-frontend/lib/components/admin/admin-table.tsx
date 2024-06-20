import { types } from "@common-utils";
import { Pagination } from "../common/pagination";
import { ReactNode } from "react";

export interface AdminTableProps {
  columns: {
    title: string;
    textAlign: 'left' | 'right' | 'center';
    dataField: string;
  }[];
  objectList: types.Paginated<any>;
  onPage: (page: number, limit: number) => void;
  actions: {
    content: ReactNode;
    operation: (object: any) => void;
  }[]
}

export function AdminTable({ columns, objectList, onPage, actions }: AdminTableProps) {
  return <table className="w-full mt-2 text-gray-500">
  <thead className="border-b">
    <tr>
      {columns.map((col, colIndex) =>
        <th key={colIndex} className={`text-${col.textAlign} text-gray-600`}>{col.title}</th>
      )}
      {
        actions.length > 0 && <th className="text-right text-gray-600">ACTIONS</th>
      }
      
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {
    objectList.data.map((obj, dataIndex) => <tr key={dataIndex} className="cursor-pointer hover:bg-slate-100">
      {columns.map((col, colIndex) => <td key={colIndex} className={`text-${col.textAlign}`}>
        {obj[col.dataField]}
      </td>)
    }
    {
      actions.length > 0 &&
      <td className="text-right">
        <div className="flex justify-end">
          {
            actions.map((action, actionIndex) => <a key={actionIndex} onClick={() => action.operation(obj)}>
              {action.content}
            </a>)
          }
        </div>
      </td>
    } 
    </tr>)
    }
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={actions.length > 0 ? columns.length+1 : columns.length}>
        <Pagination total={objectList.total} count={objectList.count} offset={objectList.offset} limit={objectList.limit} onPage={onPage} />
      </td>
    </tr>
  </tfoot>
</table >
}
