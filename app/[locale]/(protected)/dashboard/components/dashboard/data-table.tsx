import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  interface DataTableProps {
    data: Array<Record<string, unknown>>
    columns: string[]
    title: string
  }
  
  export function DataTable({ data, columns, title }: DataTableProps) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={String(item.id)}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {typeof item[column] === 'object'
                        ? item[column] instanceof Date ? item[column].toLocaleString() : JSON.stringify(item[column])
                        : String(item[column] ?? '-')
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
