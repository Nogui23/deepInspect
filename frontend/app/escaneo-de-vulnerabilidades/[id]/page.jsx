"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Globe, OctagonAlert, Calendar, Server, Trash2, Download, ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"
import PieChartGrafico from "@/components/pieChart"
import PortComponent from "@/components/PortsList"
import { Skeleton } from "@/components/ui/skeleton"
import { ExitAnimation, IntroAnimation } from "@/components/Animations"
import AcordeonPuertos from "@/components/componentesCargando/acordeonPuertos"
import { Toaster, toast } from "sonner"
import { format } from "date-fns"


const APP_STATUS = {
    LOADING: 0,
    COMPLETE: 1,
    ERROR: 2,
}

export default function DetallesBusquedaActivos() {
    const { id } = useParams()
    const [appStatus, setAppStatus] = useState(APP_STATUS.LOADING);
    const [showAnimation, setShowAnimation] = useState(true);
    const [showExitAnimation, setExitAnimation] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setAppStatus(APP_STATUS.COMPLETE);
        }, 2000);
    }, []);


    useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`http://localhost:5000/nmap/getPort/${id}`, {credentials: "include",});
				if (!response.ok){
					toast.error("Error al cargar los datos.");
					setAppStatus(APP_STATUS.ERROR);
					return;
				}else {
					const jsonData = await response.json();
					setData(jsonData);
                    console.log(jsonData);
				}
			} catch (error) {
				toast.error("Error al cargar los datos.");
				setAppStatus(APP_STATUS.ERROR);
			}
		}

		fetchData()
	}, []);

    const handleExitAnimation = () => {
        setExitAnimation(true);
        setTimeout(() => {
            window.location.href = "/escaneo-de-vulnerabilidades";
        }, 1250);
    }

    return (
        <>
            {showAnimation && <IntroAnimation onComplete={() => setShowAnimation(false)} />}
            {showExitAnimation && <ExitAnimation onComplete={() => setExitAnimation(false)} />}
            <Navbar posicion={2}/>
            {appStatus === APP_STATUS.LOADING && (
                <main className="flex items-center justify-center w-full text-white mt-36 mb-20">
                    <article className="flex flex-col justify-center max-w-7xl w-full gap-8">
                        <button onClick={handleExitAnimation}><ArrowLeft width={30} height={30}/></button>
                        <div className="flex flex-row items-center justify-between w-full">
                            <h1 className="text-xl">Detalles del escaneo</h1>
                            <div className="flex flex-row gap-4">
                                <button className="flex flex-row items-center gap-2 text-red-500 border-[1px]  border-red-500 px-4 py-1 rounded-full disabled:text-red-500/50 disabled:border-red-500/50" disabled>
                                    <Trash2 width={20} height={20}/>
                                    Borrar
                                </button>
                                <button className="flex flex-row items-center gap-2 text-white border-[1px]  border-white px-4 py-1 rounded-full disabled:text-white/50 disabled:border-white/50" disabled>
                                    <Download width={20} height={20}/>
                                    Descargar
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row w-full gap-5">
                            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-2/3 p-[30px]">
                                <div className="flex flex-col w-full gap-8">
                                    <p className="font-bold text-lg">Información basica</p>
                                    <div className="flex flex-row gap-4">
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)]  p-6">
                                            <Globe width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>es la ip</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Calendar width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>fue creado</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Server width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>puertos abiertos</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <OctagonAlert width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>cve encontrados</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-1/3 p-9">
                                <p>Purtos abiertos</p>
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <Skeleton className="h-36 w-36 rounded-full" />
                                    <div className="flex flex-col items-start justify-center gap-3 pt-5">
                                        <div className="flex flex-row items-center justify-center gap-2">
                                            <Skeleton className="h-3 w-3 rounded-full" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="flex flex-row items-center justify-center gap-2">
                                            <Skeleton className="h-3 w-3 rounded-full" />
                                            <Skeleton className="h-3 w-[100px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-full p-[40px]">
                            <h2 className="font-bold text-lg mb-4">Puertos y Vulnerabilidades</h2>
                            {Array.from({ length: 3 }, (_, index) => (
                                <AcordeonPuertos key={index}/>
                            ))}
                        </div>
                    </article>
                </main>
            )}
            {appStatus === APP_STATUS.COMPLETE && (
                <main className="flex items-center justify-center w-full text-white mt-36 mb-20">
                    <article className="flex flex-col justify-center max-w-7xl w-full gap-8">
                        <button onClick={handleExitAnimation}><ArrowLeft width={30} height={30}/></button>
                        <div className="flex flex-row items-center justify-between w-full">
                            <h1 className="text-xl">Detalles del escaneo</h1>
                            <div className="flex flex-row gap-4">
                                <button className="flex flex-row items-center gap-2 text-red-500 border-[1px]  border-red-500 px-4 py-1 rounded-full transition-all duration-300 ease-in-out hover:opacity-50">
                                    <Trash2 width={20} height={20}/>
                                    Borrar
                                </button>
                                <a  href={`http://localhost:5000/nmap/export-csv/${id}`} target="_blank" className="flex flex-row items-center gap-2 text-white border-[1px]  border-white px-4 py-1 rounded-full transition-all duration-300 ease-in-out hover:opacity-50">
                                    <Download width={20} height={20}/>
                                    Descargar
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-row w-full gap-5">
                            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-2/3 p-[30px]">
                                <div className="flex flex-col w-full gap-8">
                                    <p className="font-bold text-lg">Información basica</p>
                                    <div className="flex flex-row gap-4">
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)]  p-6">
                                            <Globe width={40} height={40}/>
                                            <p className="font-bold">{data.ip}</p>
                                            <p>es la ip</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Calendar width={40} height={40}/>
                                            <p className="font-bold">{format(new Date(data.fecha), "dd/MM/yyyy")}</p>
                                            <p>fue creado</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Server width={40} height={40}/>
                                            <p className="font-bold">+ {data.puertos.length}</p>
                                            <p>puertos abiertos</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <OctagonAlert width={40} height={40}/>
                                            <p className="font-bold">+ 13</p>
                                            <p>cve encontrados</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-1/3 p-9">
                                <p>Purtos abiertos</p>
                                <PieChartGrafico data={data.puertos} type="ports"/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-full p-[40px]">
                            <h2 className="font-bold text-lg mb-4">Puertos y Vulnerabilidades</h2>
                            {data.puertos.map((port, index) => (
                                <PortComponent
                                    key={index}
                                    portData={port}
                                />
                            ))}
                        </div>
                    </article>
                </main>
            )}
        </>
    )
} 