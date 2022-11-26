import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useTableInstance,
  TableOptions,
  Table,
  UseTableInstanceOptions
} from "@tanstack/react-table";
import { PropsWithChildren, ReactElement, useState } from "react";

interface TableProps<T extends Record<string, unknown>>
  extends UseTableInstanceOptions< {}

export const Table = <T extends Record<string, unknown>>(
  props: TableProps<T>
) => {
  const table = createTable().setRowType<T>().setColumnMetaType<T>();
  type TableGenerics = typeof table.generics;

  const [sorting, setSorting] = useState<SortingState>([]);

  const instance = useTableInstance<TableGenerics>(table, {
    columns: props.columns,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {header.renderHeader()}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return <td key={cell.id}>{cell.renderCell()}</td>;
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div>{instance.getRowModel().rows.length} Rows</div>
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
    </div>
  );
};
