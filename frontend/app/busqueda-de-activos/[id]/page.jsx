"use client"

import { useState, useEffect, use } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Globe, MapPin, Calendar, Earth, Trash2, Download, ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"
import PieChartGrafico from "@/components/pieChart"
import DomainList from "@/components/DomainList"
import { ExitAnimation, IntroAnimation } from "@/components/Animations"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

const APP_STATUS = {
    LOADING: 0,
    COMPLETED: 1,
    ERROR: 2
}

export default function DetallesBusquedaActivos() {
    const { id } = useParams()
    const [appStatus, setAppStatus] = useState(APP_STATUS.LOADING)
    const [showAnimation, setShowAnimation] = useState(true);
    const [showExitAnimation, setExitAnimation] = useState(false);
    const [activo, setActivo] = useState(0);
    const [data, setData] = useState({});


    useEffect(() => {
        const getDatos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/whois/get/${id}`, {credentials: "include",});
                const jsonData = await response.json();
                setData(jsonData);
                setAppStatus(APP_STATUS.COMPLETED);
                console.log(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setAppStatus(APP_STATUS.ERROR);
            }
        }

        getDatos();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setAppStatus(APP_STATUS.COMPLETED)
        }, 5000);
    }, []);

    const handleExitAnimation = () => {
        setExitAnimation(true);
        setTimeout(() => {
            window.location.href = "/busqueda-de-activos";
        }, 1250);
    }

    return (
        <>
            <Navbar posicion={1}/>
            {showAnimation && <IntroAnimation onComplete={() => setShowAnimation(false)} />}
            {showExitAnimation && <ExitAnimation onComplete={() => setExitAnimation(false)} />}
            {appStatus === APP_STATUS.LOADING && (
                <main className="flex items-center justify-center w-full text-white mt-36 mb-20">
                    <article className="flex flex-col justify-center max-w-7xl w-full gap-8">
                        <button onClick={handleExitAnimation}><ArrowLeft width={30} height={30}/></button>
                        <div className="flex flex-row items-center justify-between w-full">
                            <h1 className="text-xl">Detalles de Eroski</h1>
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
                                            <p>dominio principal</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <MapPin width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>esta ubicado</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Calendar width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>fue creado</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Earth width={40} height={40}/>
                                            <Skeleton className="h-6 w-[132px]" />
                                            <p>dom. y subdom.</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-1/3 p-9">
                                <p>Dominios y Subdominios</p>
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
                            <div className="flex flex-row items-center justify-center gap-24">
                                <button className={cn(activo == 0 ? "text-white" : "text-white/50", "hover:text-white duration-300 transition ease-in-out text-lg")} onClick={() => setActivo(0)}>Dominios</button>
                                <button className={cn(activo == 1 ? "text-white" : "text-white/50", "hover:text-white duration-300 transition ease-in-out text-lg")} onClick={() => setActivo(1)}>Subdominios</button>
                            </div>
                            {activo === 0 ? (
                                <DomainList items={data.reverse_domains} type="dominios" cargando={true} />
                            ) : (
                                <DomainList items={data.subdomains} type="subdominios" cargando={true}/>
                            )}
                        </div>
                    </article>
                </main>
            )}
            {appStatus === APP_STATUS.COMPLETED && (
                <main className="flex items-center justify-center w-full text-white mt-36 mb-20">
                    <article className="flex flex-col justify-center max-w-7xl w-full gap-8">
                        <button onClick={handleExitAnimation}><ArrowLeft width={30} height={30}/></button>
                        <div className="flex flex-row items-center justify-between w-full">
                            <h1 className="text-xl">Detalles de Eroski</h1>
                            <div className="flex flex-row gap-4">
                                <button className="flex flex-row items-center gap-2 text-red-500 border-[1px]  border-red-500 px-4 py-1 rounded-full transition-all duration-300 ease-in-out hover:opacity-50">
                                    <Trash2 width={20} height={20}/>
                                    Borrar
                                </button>
                                <a  href={`http://localhost:5000/whois/export-csv/${id}`} target="_blank" className="flex flex-row items-center gap-2 text-white border-[1px]  border-white px-4 py-1 rounded-full transition-all duration-300 ease-in-out hover:opacity-50">
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
                                            <p className="font-bold">{data.whois_record.url}</p>
                                            <p>dominio principal</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <MapPin width={40} height={40}/>
                                            <p className="font-bold">Bizkaia, Spain</p>
                                            <p>esta ubicado</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Calendar width={40} height={40}/>
                                            <p className="font-bold">{format(new Date(data.whois_record.fecha), "dd/MM/yyyy")}</p>
                                            <p>fue creado</p>
                                        </div>
                                        <div className="flex flex-col gap-5 w-1/4 border-[1px] rounded-3xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] p-6">
                                            <Earth width={40} height={40}/>
                                            <p className="font-bold">+ {data.reverse_domains.length + data.subdomains.length}</p>
                                            <p>dom. y subdom.</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-1/3 p-9">
                                <p>Dominios y Subdominios</p>
                                <PieChartGrafico data={data}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-full p-[40px]">
                            <div className="flex flex-row items-center justify-center gap-24">
                                <button className={cn(activo == 0 ? "text-white" : "text-white/50", "hover:text-white duration-300 transition ease-in-out text-lg")} onClick={() => setActivo(0)}>Dominios</button>
                                <button className={cn(activo == 1 ? "text-white" : "text-white/50", "hover:text-white duration-300 transition ease-in-out text-lg")} onClick={() => setActivo(1)}>Subdominios</button>
                            </div>
                            {activo === 0 ? (
                                <DomainList domains={data.reverse_domains} type="dominios" cargando={false}/>
                            ) : (
                                <DomainList domains={data.subdomains} type="subdominios" cargando={false}/>
                            )}
                        </div>
                    </article>
                </main>
            )}
        </>
    )
} 