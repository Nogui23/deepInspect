import Image from "next/image"
import Link from "next/link"

export default function Footer(){
    return (
        <footer className="flex flex-col justify-center text-white bg-opacity-20 w-full">
            <div className="flex justify-center">
                <div className="flex justify-between max-w-7xl w-full">
                    <div className="space-y-2">
                        <p>Información de Contacto</p>
                        <div className="space-y-2">
                            <div className="flex space-x-2 opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">
                                <Image src={"/correo.svg"} width={20} height={20} alt="Logo Github" />
                                <p>asier.nogues@live.u-tad.com</p>
                            </div>
                            <p className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">v1.0 (Proyecto de Fin de Grado)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p>Secciones Adicionales</p>
                        <div className="space-y-2">
                            <p className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">Aviso Legal</p>
                            <p className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">Política de Privacidad</p>
                            <p className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">Términos de Uso</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p>Redes Sociales</p>
                        <div className="space-y-2">
                            <Link className="flex space-x-2 opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out" href={"https://github.com/Nogui23"} target="_blank" rel="noopener noreferrer">
                                <Image src={"/github.svg"} width={20} height={20} alt="Logo Github" />
                                <p>GitHub</p>
                            </Link>
                            <Link className="flex space-x-2 opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out" href={"https://www.linkedin.com/in/asier-nogues-296324299/"} target="_blank" rel="noopener noreferrer">
                                <Image src={"/linkedin.svg"} width={20} height={20} alt="Logo LinkedIn" />
                                <p>LinkedIn</p>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p>Elemento Técnicos</p>
                        <div className="space-y-2">
                            <p className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">Desarrollado con Next.js y Flask</p>
                            <p className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">Proyecto de Fin de Grado</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-center my-10">© 2025 DeepInspect. Todos los derechos reservados.</p>
        </footer>
    )
}