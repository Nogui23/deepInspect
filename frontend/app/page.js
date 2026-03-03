"use client"

import { useState } from "react";
import Navbar from "@/components/Navbar"
import { ArrowRight, ShieldCheck, WandSparkles, Feather, Layers } from "lucide-react";
import Link from "next/link";
import {IntroAnimation, ExitAnimation} from "@/components/Animations";

export default function HomePage() {
    const [showAnimation, setShowAnimation] = useState(true);

    return (
    <>
        {showAnimation && <IntroAnimation onComplete={() => setShowAnimation(false)} />}
        <Navbar/>
        <div className="w-full flex flex-col items-center justify-center pt-16">
            <main className="flex flex-col justify-center items-center max-w-7xl w-full text-white pb-32">
                <article className="flex flex-col items-center text-center w-[580px] 2xl:my-[calc(100vh-800px)] my-[calc(100vh-750px)]">
                    <h1 className="font-bold text-white text-[85px] leading-[1.05] w-[480px] mb-6">Investiga más rápido.</h1>
                    <h2 className="text-white opacity-50 text-2xl text-center">Potencia tus investigaciones con DeepInspect. Presentamos nuevas herramientas perfectas para tu análisis.</h2>
                </article>
                <article className="flex flex-col items-center text-center w-full mb-20">
                    <div className="flex flex-col items-center text-white w-1/2 space-y-2 text-center ">
                        <div className="drop-shadow-[0px_4px_18px_rgba(0,130,217,0.85)]">
                            <p className="bg-gradient-to-r from-[#A6DDFF] via-[#33C2FF] to-[#0077FF] bg-clip-text text-transparent text-sm font-bold">Productividad</p>
                        </div>
                        <p className="font-bold text-4xl w-4/5">Expande tus herramientas de análisis.</p>
                        <p className="text-xl opacity-50">Descubra nuevas automatizaciones que transforman sus investigaciones. Mejora tus proyectos con potentes herramientas, desde datos información de activos hasta CVEs en IPs.</p>
                    </div>
                </article>
                <article className="flex flex-col w-full h-full pb-32">
                    <div className="w-full h-full flex flex-row p-10">
                        <div className="w-2/5 h-auto flex flex-col items-start justify-center space-y-2">
                            <p className="text-2xl font-bold w-72">No se trata sólo de ahorrar tiempo.</p>
                            <p className="text-xl opacity-50 w-72">Es sobre ser más eficiente mientras DeepInspect investiga por ti.</p>
                            <Link href={"/registro"} className="text-base text-black bg-white px-[10px] py-[6px] rounded-full transition-all duration-300 ease-in-out hover:opacity-50">Empieza ya</Link>
                        </div>
                        <div className=" w-3/5 items-center flex flex-col gap-3 box-border text-white font-sans leading-[18.4px] max-w-full overflow-hidden pl-8 tab-size-[4] text-[100%] isolate antialiased"
                            style={{
                            maskImage: "radial-gradient(95% 55% at 10.02% 47.84%, rgb(217, 217, 217) 16.79%, rgba(217, 217, 217, 0) 83.76%)"
                            }}
                        >
                            {/* Fila 1 */}
                            <div className="flex flex-row w-full h-[112px] gap-3">
                                <div className="flex flex-col w-[145px] h-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <span className="flex items-end w-full h-1/2 text-2xl">esc</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <p className="flex items-end justify-center w-full h-1/2">F1</p>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <p className="flex items-end justify-center w-full h-1/2">F2</p>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <p className="flex items-end justify-center w-full h-1/2">F3</p>
                                </div>
                            </div>

                            {/* Fila 2 */}
                            <div className="flex flex-row w-full h-[112px] gap-3">
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-start justify-center w-full h-1/2 text-3xl">±</span>
                                    <span className="flex items-end justify-center w-full h-1/2 text-3xl">§</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-start justify-center w-full h-1/2 text-2xl">!</span>
                                    <span className="flex items-end justify-center w-full h-1/2 text-3xl">1</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-start justify-center w-full h-1/2 text-2xl">@</span>
                                    <span className="flex items-end justify-center w-full h-1/2 text-3xl">2</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-start justify-center w-full h-1/2 text-2xl">#</span>
                                    <span className="flex items-end justify-center w-full h-1/2 text-3xl">3</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-start justify-center w-full h-1/2 text-2xl">$</span>
                                    <span className="flex items-end justify-center w-full h-1/2 text-3xl">4</span>
                                </div>
                            </div>

                            {/* Fila 3 */}
                            <div className="flex flex-row w-full h-[112px] gap-3">
                                <div className="flex flex-col w-[170px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <div className="flex items-end w-full h-1/2 text-2xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="19" fill="none"><path fill="#D8D8D8" d="M13.844 18.194q.48 0 .87-.375l7.755-7.725q.42-.39.42-.9t-.42-.915L14.714.569q-.39-.375-.87-.375-.495 0-.84.33t-.345.825q0 .24.082.465.083.225.248.39l2.085 2.145 5.055 4.56.27-.78-3.69-.15H1.754q-.54 0-.87.337-.33.338-.33.878 0 .525.33.862.33.338.87.338h14.955l3.69-.135-.27-.78-5.055 4.56-2.085 2.13q-.165.165-.248.39t-.082.465q0 .51.345.84t.84.33m10.245 0q.525 0 .87-.33t.345-.84V1.379q0-.525-.345-.855t-.87-.33-.87.33-.345.855v15.645q0 .51.345.84t.87.33" className="fill:color(display-p3 .8458 .8458 .8458);fill-opacity:1"></path></svg>
                                    </div>
                                </div>
                                <div className="bg-[radial-gradient(75%_75%_at_50%_91.9%,_rgb(18,_18,_18)_0px,_rgb(13,_13,_13)_100%)] shadow-[rgba(0,0,0,0.4)_0px_1.5px_0.5px_2.5px,_rgb(0,0,0)_0px_0px_0.5px_1px,_rgba(0,0,0,0.25)_0px_2px_1px_1px_inset,_rgba(255,255,255,0.2)_0px_1px_1px_1px_inset,_rgba(0,0,0,0)_0px_0px_0px_0px_inset] rounded-[11px] text-white opacity-100 px-[15px] py-[14.5px] text-shadow-[rgba(0,0,0,0.1)_0px_0.5px_0.5px] transition-all  duration-[0.4s] ease-[cubic-bezier(0.23,_1,_0.32,_1)] w-[190px]">
                                    <div className="h-1/2"> 
                                        <Feather/>
                                    </div>
                                    <p><span className="font-bold">Rápido.</span> Te libera de una carga.</p>
                                </div>
                                <div className="bg-[radial-gradient(75%_75%_at_50%_91.9%,_rgb(18,_18,_18)_0px,_rgb(13,_13,_13)_100%)] shadow-[rgba(0,0,0,0.4)_0px_1.5px_0.5px_2.5px,_rgb(0,0,0)_0px_0px_0.5px_1px,_rgba(0,0,0,0.25)_0px_2px_1px_1px_inset,_rgba(255,255,255,0.2)_0px_1px_1px_1px_inset,_rgba(0,0,0,0)_0px_0px_0px_0px_inset] rounded-[11px] text-white opacity-100 px-[15px] py-[14.5px] text-shadow-[rgba(0,0,0,0.1)_0px_0.5px_0.5px] transition-all duration-[0.4s] ease-[cubic-bezier(0.23,_1,_0.32,_1)] w-[190px]">
                                    <div className="w-full h-1/2">
                                        <WandSparkles/>
                                    </div>
                                    <p><span className="font-bold">Simple.</span> Lo hace por ti sin complicaciones.</p>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">R</span>
                                </div>
                            </div>

                            {/* Fila 4 */}
                            <div className="flex flex-row w-full h-[112px] gap-3">
                            <div className="bg-[radial-gradient(75%_75%_at_50%_91.9%,_rgb(18,_18,_18)_0px,_rgb(13,_13,_13)_100%)] shadow-[rgba(0,0,0,0.4)_0px_1.5px_0.5px_2.5px,_rgb(0,0,0)_0px_0px_0.5px_1px,_rgba(0,0,0,0.25)_0px_2px_1px_1px_inset,_rgba(255,255,255,0.2)_0px_1px_1px_1px_inset,_rgba(0,0,0,0)_0px_0px_0px_0px_inset] rounded-[11px] text-white opacity-100 px-[15px] py-[14.5px] text-shadow-[rgba(0,0,0,0.1)_0px_0.5px_0.5px] transition-all duration-[0.4s] ease-[cubic-bezier(0.23,_1,_0.32,_1)] w-[210px]">
                                    <div className="h-1/2">
                                        <Layers/>
                                    </div>
                                    <p><span className="font-bold">Preparado.</span> Adaptado para todos los casos.</p>
                                </div>
                                <div className="bg-[radial-gradient(75%_75%_at_50%_91.9%,_rgb(18,_18,_18)_0px,_rgb(13,_13,_13)_100%)] shadow-[rgba(0,0,0,0.4)_0px_1.5px_0.5px_2.5px,_rgb(0,0,0)_0px_0px_0.5px_1px,_rgba(0,0,0,0.25)_0px_2px_1px_1px_inset,_rgba(255,255,255,0.2)_0px_1px_1px_1px_inset,_rgba(0,0,0,0)_0px_0px_0px_0px_inset] rounded-[11px] text-white opacity-100 px-[15px] py-[14.5px] text-shadow-[rgba(0,0,0,0.1)_0px_0.5px_0.5px] transition-all duration-[0.4s] ease-[cubic-bezier(0.23,_1,_0.32,_1)] w-[180px]">
                                    <div className="h-1/2"> 
                                        <ShieldCheck/>
                                    </div>
                                    <p><span className="font-bold">Confiable.</span> Te informa de todo.</p>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">S</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">D</span>
                                </div>
                            </div>

                            {/* Fila 5 */}
                            <div className="flex flex-row w-full h-[112px] gap-3">
                                <div className="flex flex-col w-[139px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <div className="flex items-end w-full h-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none">
                                            <path fill="#D8D8D8" d="M8.632 20.41h6.357q1.215 0 1.835-.662.621-.662.621-1.794v-4.611h4.175q.723 0 1.22-.41.5-.409.499-1.077 0-.423-.191-.744a3.6 3.6 0 0 0-.505-.648l-9.454-9.413a2.5 2.5 0 0 0-.635-.464 1.61 1.61 0 0 0-1.473 0 2.7 2.7 0 0 0-.648.464l-9.44 9.413a3.3 3.3 0 0 0-.526.655q-.184.315-.184.737 0 .668.504 1.078.506.409 1.215.409h4.174v4.611q0 1.133.621 1.794.621.662 1.835.662m.205-1.897a.6.6 0 0 1-.444-.17.6.6 0 0 1-.17-.444v-6.03q0-.368-.382-.368H2.998q-.082 0-.082-.068 0-.041.04-.096l8.718-8.635a.19.19 0 0 1 .137-.055q.082 0 .136.055l8.718 8.635q.054.056.054.096 0 .068-.082.068h-4.856q-.382 0-.382.368v6.03q0 .26-.178.437a.6.6 0 0 1-.436.177z" className="fill:color(display-p3 .8458 .8458 .8458);fill-opacity:1"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="flex w-full h-1/2">
                                        <span className="flex items-start justify-center w-1/2 h-1/2 text-2xl">&lt;</span>
                                        <span className="flex items-start justify-center w-1/2 h-1/2 text-2xl">&gt;</span>
                                    </div>
                                    <div className="w-full h-1/2"/>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">Z</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">X</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">C</span>
                                </div>
                            </div>

                            {/* Fila 6 */}
                            <div className="flex flex-row w-full h-[112px] gap-3">
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <span className="flex items-end w-full h-1/2">ctrl</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <div className="w-full h-1/2"/>
                                    <span className="flex items-end w-full h-1/2">win</span>
                                </div>
                                <div className="flex flex-col w-[112px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">alt</span>
                                </div>
                                <div className="flex flex-col w-[350px] border-[1px] border-white border-opacity-50 rounded-2xl px-[15px] py-[14.5px]">
                                    <span className="flex items-center justify-center w-full h-full text-2xl">X</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <article className="flex flex-col items-center text-center w-full mb-20">
                    <div className="flex flex-col items-center text-white w-1/2 space-y-2 text-center ">
                        <div className="drop-shadow-[0px_4px_18px_rgba(0,130,217,0.85)]">
                            <p className="bg-gradient-to-r from-[#A6DDFF] via-[#33C2FF] to-[#0077FF] bg-clip-text text-transparent text-sm font-bold">Utilidad</p>
                        </div>
                        <p className="font-bold text-4xl w-4/5">Organiza tus proyectos.</p>
                        <p className="text-xl opacity-50 w-4/5">Aprovecha la potencia de DeepInspect para gestionar tus proyectos, productividad y mantener tu proceso de investigación organizado sin esfuerzo.</p>
                    </div>
                </article>

                <article className="flex flex-col w-full gap-[10px]">
                    <div className="flex flex-row w-full h-full gap-[10px]">
                        <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-2/5 h-[560px] p-[40px]">
                            <div className="w-[30px] h-[30px] bg-white rounded-md gap-5"/>
                            <div className="flex flex-col w-full h-full gap-[10px]">
                                <p className="text-xl font-bold">Whois</p>
                                <p className="text-lg opacity-50 w-4/5">Búsqueda de activos vinculada con Whois para ofrecer mayor precisión a la hora de empezar un proyecto.</p>
                                <Link className="flex space-x-2 transition-all duration-300 ease-in-out hover:opacity-50 group" href={"/login"}>
                                    <span className="text-xl">Pruébalo ya</span>
                                    <ArrowRight className="transition-all duration-300 ease-in-out group-hover:translate-x-2" />
                                </Link>

                            </div>
                        </div> 
                        <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 bg-[radial-gradient(139%_78%_at_0%_0%,_rgba(47,_204,_97,_0.30)_0%,_rgba(0,_3,_15,_0)_100%)] rounded-2xl w-3/5 h-[560px] p-10">
                            <div className="w-[30px] h-[30px] bg-green-400 rounded-md"/>
                            <div className="flex flex-col w-full h-full gap-[10px]">
                                <p className="text-xl font-bold">Excel</p>
                                <p className="text-lg opacity-50 w-4/5">Lleva tus datos de DeepInspect a tu editor de texto favorito, tanto Google Sheets como Microsoft Excel sin esfuerzo, convirtiendo las hojas de cálculo en contenido para tus investigaciones.</p>
                                <Link className="flex space-x-2 transition-all duration-300 ease-in-out hover:opacity-50 group" href={"/login"}>
                                    <span className="text-xl">Pruébalo ya</span>
                                    <ArrowRight className="transition-all duration-300 ease-in-out group-hover:translate-x-2" />
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(120%_123%_at_100%_100%,_rgb(36,_36,_36)_0%,_rgba(0,_0,_0,_0.93)_100%)] w-full h-[560px] p-10">
                        <div className="w-[30px] h-[30px] bg-white rounded-md"/>
                        <div className="flex flex-col w-full h-full gap-[10px]">
                            <p className="text-xl font-bold">Escaneo de vulnerabilidades</p>
                            <p className="text-lg opacity-50 w-2/3">En este apartado tendras el maximo detalle sobre una dirección IP, desde sus puertos numerados con sus versiones hasta todos los posibles CVEs que podrían afectar al sistema. Todo esto gracias a Nmap y VulnHub.</p>
                            <Link className="flex space-x-2 transition-all duration-300 ease-in-out hover:opacity-50 group" href={"/login"}>
                                <span className="text-xl">Pruébalo ya</span>
                                <ArrowRight className="transition-all duration-300 ease-in-out group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    </>
  );
}