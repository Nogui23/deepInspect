import Link from "next/link"

export default function NavbarSinOpciones(){
    return(
        <nav className="bg-[#505050] bg-opacity-50 flex justify-between h-[75px] w-full items-center px-[32px]">
            <div className="flex items-center">
                <div className="w-[50px] h-[50px] bg-white"/>
                <p className="pl-[16px] text-white text-2xl font-bold">DeepInspect</p>
            </div>
        </nav>
    )
}