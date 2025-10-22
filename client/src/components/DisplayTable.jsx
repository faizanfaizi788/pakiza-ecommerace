import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const DisplayTable = ({ data, column }) => {
  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="border-r border-purple-400 px-4 py-3 text-white font-semibold text-left text-sm uppercase tracking-wider">
                Sr.No
              </th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-r border-purple-400 px-4 py-3 text-white font-semibold text-left text-sm uppercase tracking-wider whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-purple-100">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
            >
              <td className="border-r border-purple-100 px-4 py-3 text-gray-700 font-medium text-center bg-gradient-to-r from-purple-50 to-blue-50">
                {index + 1}
              </td>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-r border-purple-100 px-4 py-3 text-gray-700 whitespace-nowrap"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayTable;
