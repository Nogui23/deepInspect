"use client"

import { use, useEffect, useState } from "react";
import { ExitAnimation, IntroAnimation } from "@/components/Animations";
import Navbar from "@/components/Navbar"
import Tabla from "@/components/tabla"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Toaster, toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const APP_STATUS = {
	LOADING: 0,
	COMPLETE: 1,
	ERROR: 2
}

export default function BusquedaDeActivos(){
	const [appStatus, setAppStatus] = useState(APP_STATUS.LOADING);
	const [showAnimation, setShowAnimation] = useState(true);
	const [showExitAnimation, setShowExitAnimation] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [newItem, setNewItem] = useState("");
	const [data, setData] = useState([]);
    const columns = [
		{
			accessorKey: "id",
			header: ({ column }) => (
				<Button
					className="text-white font-bold"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Id <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
			<Button
				className="text-white font-bold"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Nombre del activo <ArrowUpDown />
			</Button>
			),
			cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
		},
		{
			accessorKey: "estado",
			header: (<p className="text-white font-bold">Estado de la búsqueda</p>),
			cell: ({ row }) => {
				const estado = row.getValue("estado");
				let estadoTexto = "";
				
				if (estado === 0) 
					estadoTexto = "En proceso";
				else if (estado === 1) 
					estadoTexto = "Completado";
				else if (estado === 2) 
					estadoTexto = "Error";
				
			  
			  	return <div className="lowercase">{estadoTexto}</div>;
			}
		},
		{
			accessorKey: "fecha",
			header: ({ column }) => (
			<Button
				className="text-white font-bold"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Fecha de la búsqueda <ArrowUpDown />
			</Button>
			),
			cell: ({ row }) => <div className="lowercase">{format(new Date(row.getValue("fecha")), "d 'de' MMMM 'de' yyyy", {locale: es})}</div>,
		},
		{
			accessorKey: "actions",
			header: (<p className="text-white font-bold">Acciones</p>),
			cell: ({ row }) => {
				const status = row.getValue("estado");
			
				return status === 1 ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Abrir menu</span>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuSeparator />
							<DropdownMenuItem>Borrar</DropdownMenuItem>
							<DropdownMenuItem>Actualizar</DropdownMenuItem>
							<DropdownMenuItem>Descargar</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<div className="h-8 w-8"/>
				);
			},
		},
	];

	useEffect(() => {
		getBusquedas();
	}, []);

	const getBusquedas = async () => {
		setAppStatus(APP_STATUS.LOADING);
		try {
			const response = await fetch("http://localhost:5000/whois/getAll", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error("Error al obtener los datos");
			}
			const data = await response.json();
			setData(data);
			setAppStatus(APP_STATUS.COMPLETE);
		} catch (error) {
			toast.error("Error al obtener los datos de las busquedas");
		}
	}

	const handleNewItem = async () => {
		if (newItem === "") {
			toast.error("La url no puede estar vacia");
			return;
		}
		try {
			const response = await fetch("http://localhost:5000/whois/createActiveSearch", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url: newItem }),
			});
			if (!response.ok) {
				throw new Error("Error al crear la busqueda");
			}

			toast.success("Busqueda creada correctamente");
			setNewItem("");
			setShowModal(false);
		} catch (error) {
			toast.error("Error al crear la busqueda");
		}
	}

    return(
        <>
			{showAnimation && <IntroAnimation onComplete={() => setShowAnimation(false)} />}
			{showExitAnimation && <ExitAnimation onComplete={() => setExitAnimation(false)} />}
            <Toaster richColors/>
			<Navbar posicion={1}/>
            {appStatus === APP_STATUS.LOADING && (
				<main className="flex items-center justify-center w-full text-white mt-36 mb-20">
					<article className="flex flex-col justify-center max-w-7xl w-full gap-8">
						<section className="flex justify-between w-full">
							<p className="text-3xl font-bold">Historial de Búsqueda de activos</p>
							<button className={"text-base  text-black bg-white px-3 py-2 rounded-full disabled:bg-white/50"} disabled>Nueva búsqueda</button>
						</section>
						<section className="flex flex-col gap-5 h-[750px] border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-full p-[40px]">
							<Tabla data={data} columns={columns} url={"/busqueda-de-activos/"} setShowExitAnimation={setShowExitAnimation} cargando={true}/>
						</section>
					</article>
				</main>
			)}
			{appStatus === APP_STATUS.COMPLETE && (
				<main className="flex items-center justify-center w-full text-white mt-36 mb-20">
					<article className="flex flex-col justify-center max-w-7xl w-full gap-8">
						<section className="flex justify-between w-full">
							<p className="text-3xl font-bold">Historial de Búsqueda de activos</p>
							<Dialog open={showModal} onOpenChange={setShowModal}>
								<DialogTrigger asChild>
									<button className={"text-base  text-black bg-white px-3 py-2 rounded-full transition-all duration-300 ease-in-out hover:opacity-50"} onClick={() => setShowModal(true)}>Nueva búsqueda</button>
								</DialogTrigger>
								<DialogContent className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-black bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)]">
									<DialogHeader>
									<DialogTitle className="text-white">Nueva busqueda de activo</DialogTitle>
									<DialogDescription>
										Introduce la url del activo que quieres buscar. Recuerda que la url debe ser valida y no puede estar vacia.
									</DialogDescription>
									</DialogHeader>
									<div className="flex w-full items-center py-8">
										<div className="relative h-11 w-full  mb-3">
											<input
												placeholder="Introduce la url del activo (www.u-tad.com)"
												id={newItem}
												name={newItem}
												type="text"
												className="peer h-full w-full border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border-white focus:border-white focus:bg-transparent focus:outline-0 placeholder:opacity-0 focus:placeholder:opacity-100"
												autoComplete="off"
												value={newItem}
												onChange={(e) => setNewItem(e.target.value)}
												required
											/>
											<label className='after:content[""] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-white after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-white peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-white '>
												Url del activo
											</label>
										</div>
									</div>
									<DialogFooter>
										<button onClick={handleNewItem} className="text-base w-full text-black bg-white px-[10px] py-[6px] rounded-full transition-all duration-300 ease-in-out hover:opacity-50">Crear búsqueda del activo</button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</section>
						<section className="flex flex-col gap-5 h-[750px] border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-full p-[40px]">
							<Tabla data={data} columns={columns} url={"/busqueda-de-activos/"} setShowExitAnimation={setShowExitAnimation}/>
						</section>
					</article>
				</main>
			)}
        </>
    )
}