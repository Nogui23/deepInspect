"use client"

import { useState } from "react";
import { IntroAnimation, ExitAnimation } from "@/components/Animations";
import Navbar from "@/components/Navbar";
import { toast, Toaster} from "sonner"


export default function RegisterPage() {
    const [showAnimation, setShowAnimation] = useState(true);
    const [showExitAnimation, setShowExitAnimation] = useState(false);
    const [usuarioIntroducido, setUsuarioIntroducido] = useState({username: "", email: "", password: "", password2: ""});

    const handleSesion = async () => {
        if (usuarioIntroducido.username === "" || usuarioIntroducido.email === "" || usuarioIntroducido.password === "" || usuarioIntroducido.password2 === "") {
            toast.error("Por favor, rellena todos los campos")
            return
        }

        if (usuarioIntroducido.password !== usuarioIntroducido.password2) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        toast.info(usuarioIntroducido.email + " " + usuarioIntroducido.password)
        toast.success("Sesión iniciada correctamente")
    }

    const handleExitAnimation = () => {
        setShowExitAnimation(true);
        setTimeout(() => {
            window.location.href = "/login";
        }, 1250); 
    }

    return(
        <>
            {showAnimation && <IntroAnimation onComplete={() => setShowAnimation(false)} />}
            {showExitAnimation && <ExitAnimation onComplete={() => setShowExitAnimation(false)} />}
            <Navbar/>
            <main className="flex items-center justify-center w-full min-h-[calc(100vh-230px)]">
                <article className="max-w-7xl w-full h-full mt-16 flex justify-center items-center">
                    <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-2/5 h-[500px] p-[40px]">
                        <div className="flex flex-col justify-between w-full h-full  text-white">
                            <h1 className="text-4xl font-bold">Resgitro</h1>
                            <div onSubmit={handleSesion} className="flex flex-col gap-2">
                                <div className="relative h-11 w-full  mb-3">
                                    <input
                                        placeholder="Nombre de usuario"
                                        id="username"
                                        name="username"
                                        type="text"
                                        className="peer h-full w-full border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border-white focus:border-white focus:bg-transparent focus:outline-0 placeholder:opacity-0 focus:placeholder:opacity-100"
                                        autoComplete="off"
                                        value={usuarioIntroducido.username}
                                        onChange={(e) =>
                                            setUsuarioIntroducido({...usuarioIntroducido, username: e.target.value})
                                        }
                                        required
                                    />
                                    <label className='after:content[""] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-white after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-white peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-white '>
                                        Nombre de usuario
                                    </label>
                                </div>
                                <div className="relative h-11 w-full  mb-3">
                                    <input
                                        placeholder="Correo electrónico"
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="peer h-full w-full border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border-white focus:border-white focus:bg-transparent focus:outline-0 placeholder:opacity-0 focus:placeholder:opacity-100"
                                        autoComplete="off"
                                        value={usuarioIntroducido.email}
                                        onChange={(e) =>
                                            setUsuarioIntroducido({...usuarioIntroducido, email: e.target.value})
                                        }
                                        required
                                    />
                                    <label className='after:content[""] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-white after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-white peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-white '>
                                        Correo electrónico
                                    </label>
                                </div>

                                <div className="relative h-11 w-full  mb-3">
                                    <input
                                        placeholder="Contraseña"
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="peer h-full w-full border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border-white focus:border-white focus:bg-transparent focus:outline-0 placeholder:opacity-0 focus:placeholder:opacity-100"
                                        autoComplete="off"
                                        value={usuarioIntroducido.password}
                                        onChange={(e) =>
                                            setUsuarioIntroducido({...usuarioIntroducido, password: e.target.value})
                                        }
                                        required
                                    />
                                    <label className='after:content[""] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-white after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-white peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-white '>
                                        Contraseña
                                    </label>
                                </div>
                                <div className="relative h-11 w-full  mb-3">
                                    <input
                                        placeholder="Confirmar contraseña"
                                        id="password2"
                                        name="password2"
                                        type="password"
                                        className="peer h-full w-full border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border-white focus:border-white focus:bg-transparent focus:outline-0 placeholder:opacity-0 focus:placeholder:opacity-100"
                                        autoComplete="off"
                                        value={usuarioIntroducido.password2}
                                        onChange={(e) =>
                                            setUsuarioIntroducido({...usuarioIntroducido, password2: e.target.value})
                                        }
                                        required
                                    />
                                    <label className='after:content[""] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-white after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-white peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-white '>
                                        Confirmar contraseña
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col items-center w-full gap-3">
                                <button onClick={handleSesion} className="text-base w-full text-black bg-white px-[10px] py-[6px] rounded-full transition-all duration-300 ease-in-out hover:opacity-50">Registrarte</button>
                                <button onClick={handleExitAnimation} className="opacity-50 hover:opacity-100 duration-300 transition-all ease-in-out hover:underline">¿Tienes cuenta? <span className="font-bold">Inicia sesión aquí</span></button>
                            </div>
                        </div>
                    </div>

                </article>
            </main>
            <Toaster richColors/>
        </>
    )
}