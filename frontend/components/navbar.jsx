import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ExitAnimation } from "@/components/Animations"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar({posicion}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState("")
    const [showExitAnimation, setShowExitAnimation] = useState(false);

    const handleExitAnimation = (href) => {
        setShowExitAnimation(true)
        setTimeout(() => {
            window.location.href = href
        }, 1250)
    }

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("http://localhost:5000/usuarios", {
                method: "GET",
                credentials: "include",
            })

            if (response.status === 200){
                const data = await response.json()
                setUsername(data.username) 
                setIsAuthenticated(true)
            }else 
                setIsAuthenticated(false)
        }

        fetchUser()
    }, [])

    const handleCerrarSesion = async () => {
        const response = await fetch("http://localhost:5000/usuarios/logout", {
            method: "POST",
            credentials: "include",
        })

        if (response.status === 200) {
            setIsAuthenticated(false)
            handleExitAnimation("/")
        } else {
            console.error("Error al cerrar sesión")
        }
    }

    return (
        <>
            {showExitAnimation && <ExitAnimation onComplete={() => setShowExitAnimation(false)} />}
            <nav className="fixed top-0 left-0 flex justify-center items-center h-16 w-full text-white bg-black bg-opacity-25 backdrop-blur-md z-10">
                <div className="flex justify-between items-center max-w-7xl w-full space-x-10">
                    <button className="flex items-center" onClick={() => handleExitAnimation("/")}>
                        <img className="w-[50px] h-[50px]" src="/Logo.png"/>
                        <p className="pl-[16px] text-2xl font-bold">DeepInspect</p>
                    </button>
                    <div className="flex items-center space-x-10">
                        <button onClick={() => handleExitAnimation("/busqueda-de-activos")} className={cn("text-base transition-all duration-300 ease-in-out hover:opacity-100", posicion === 1 ? "opacity-100"  : "opacity-50")}>Búsqueda de activos</button>
                        <button onClick={() => handleExitAnimation("/escaneo-de-vulnerabilidades")} className={cn("text-base transition-all duration-300 ease-in-out hover:opacity-100", posicion === 2 ? "opacity-100"  : "opacity-50")}>Escaneo de vulnerabilidades</button>
                    </div>
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarFallback className="text-black">{username[0]}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleCerrarSesion}>Cerrar Sesión</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <button onClick={() => handleExitAnimation("/login")} className="text-base opacity-50 transition-all duration-300 ease-in-out hover:opacity-100">Iniciar sesión</button>
                            <button onClick={() => handleExitAnimation("/register")} className="text-base text-black bg-white px-[10px] py-[6px] rounded-full transition-all duration-300 ease-in-out hover:opacity-50">Registrarse</button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}
