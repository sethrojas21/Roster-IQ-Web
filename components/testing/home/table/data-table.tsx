"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { router } from "expo-router"
import * as React from "react"
import { ScrollView, View } from "react-native"
import { RankingsPageRow } from "../../rankings/columns"
import { HomePageRow } from "./columns"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: string
  showIndex?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  showIndex = true,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
    )
    const allColumns = React.useMemo(() => {
      if (!showIndex) return columns;
      
      const indexColumn: ColumnDef<TData, TValue> = {
        id: 'index',
        header: '#',
        size: 50,
        cell: info => {
          // Get the actual position after sorting/filtering
          const sortedRows = info.table.getSortedRowModel().rows;
          const rowIndex = sortedRows.findIndex(row => row.id === info.row.id);
          return <span>{rowIndex + 1}</span>;
        },
      };

      return [indexColumn, ...columns];
    }, [columns, showIndex]);

    const table = useReactTable({
        data,
        columns: allColumns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
          sorting,
          columnFilters
        },
    })

  return (
    <View style={{
      overflow: 'hidden',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(38, 38, 38, 0.8)',
      backgroundColor: '#030303',
      maxHeight: 500, // adjust this value to control table height
    }}>
      {/* subtle top sheen */}
      <View style={{
        height: 24,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        opacity: 0.5
      }} />

      <ScrollView horizontal={true} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Table style={{ flex: 1, width: '100%' }}>
            <TableHeader className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70">
              {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-neutral-800/70"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-400"
                    style={{
                      width: header.column.columnDef.size || 'auto',
                      minWidth: header.column.columnDef.minSize || 'auto',
                      maxWidth: header.column.columnDef.maxSize || 'auto',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
            
          <TableBody className="text-neutral-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (                
                <TableRow
                  onClick={() => {
                    if (page == "rankings") {
                      const rowData = row.original as HomePageRow;
                      router.push({
                        pathname: "/rankings",
                        params: {
                          teamName: rowData.team_name,
                          playerName: rowData.player_name,
                          seasonYear: rowData.season_year,
                          playerId: rowData.player_id,
                          position: rowData.position
                        }
                      });
                    } else if (page == "breakdown") {
                        const rowData = row.original as RankingsPageRow;
                        router.push({
                          pathname: "/breakdown",
                          params: {
                            player_name : rowData.player_name,
                            player_id : 1
                          }
                        });
                    }
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-neutral-900/70 transition-colors hover:bg-neutral-900/50 data-[state=selected]:bg-neutral-900/70 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-5 py-4 align-middle text-sm text-neutral-200/95"
                      style={{
                        width: cell.column.columnDef.size || 'auto',
                        minWidth: cell.column.columnDef.minSize || 'auto',
                        maxWidth: cell.column.columnDef.maxSize || 'auto',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-t border-neutral-800/70">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-neutral-400"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </ScrollView>
      </ScrollView>
    </View>
  )
}