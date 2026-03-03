"use client"

import { useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EllipsisIcon } from "lucide-react"

export default function Tabla({ data, columns, url, setShowExitAnimation, cargando = false }) {
	const [sorting, setSorting] = useState([])
	const [columnFilters, setColumnFilters] = useState([])
	const [columnVisibility, setColumnVisibility] = useState({})
	const [rowSelection, setRowSelection] = useState({})
	const [activePage, setActivePage] = useState(1)

	const table = useReactTable({
		data: cargando ? Array(10).fill({}) : data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	const handleRedirect = (data) => {
		if (!data || cargando) 
			return

		if (data.estado === 1) {
			setShowExitAnimation(true)
			setTimeout(() => {
				window.location.href = `${url}/${data.id}`
			}, 1250)
		}
	}

	return (
		<div className="flex flex-col justify-between w-full h-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Filtrar por..."
					value={table.getColumn("name")?.getFilterValue() ?? ""}
					onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					className="max-w-sm"
					disabled={cargando}
				/>
			</div>
			<div className="h-full">
				<div className="rounded-md flex justify-start">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						{cargando ? (
							<TableBody>
								{Array.from({ length: 10 }, (_, rowIndex) => (
									<TableRow key={rowIndex} className="cursor-default">
										{columns.map((_, colIndex) => {
											const isLastColumn = colIndex === columns.length - 1
											return (
												<TableCell key={`${rowIndex}-${colIndex}`} className="px-[22px]">
													{isLastColumn ? (
														<EllipsisIcon className="w-4 h-4" />
													) : (
														<div className="h-6 bg-white/10 animate-pulse rounded-md w-full"></div>
													)}
												</TableCell>
											)
										})}
									</TableRow>
								))}
							</TableBody>
						) : (
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id} onClick={() => handleRedirect(data[row.id])} className="cursor-pointer">
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id} className="px-[22px]">
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											Sin resultados.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						)}
					</Table>
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				{!cargando && (
					<div className="flex-1 text-sm text-muted-foreground">
						{activePage} de {table.getPageCount()}
					</div>
				) }
				<div className="space-x-2">
					<Button
						size="sm"
						className="text-base text-white bg-white/25 border-0 px-3 py-2 rounded-full transition-all duration-300 ease-in-out hover:opacity-75 hover:bg-white/10"
						onClick={() => {
							table.previousPage()
							setActivePage(activePage - 1)
						}}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-base text-black bg-white px-3 py-2 rounded-full transition-all duration-300 ease-in-out hover:opacity-50"
						onClick={() => {
							table.nextPage()
							setActivePage(activePage + 1)
							}}
						disabled={!table.getCanNextPage()}
					>
						Siguiente
					</Button>
				</div>
			</div>
		</div>
	)
}

