"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

export default function Modal({ titulo, inputName, inputPlaceHolder, url, buttonName, isOpen, onClose }) {
    const [inputValue, setInputValue] = useState("");
    const handleSesion = async () => {
        if (inputValue === "") {
            toast.error("Por favor, completa el campo");
            
            return;
        }
    }
    return(
        
        <div className="flex flex-col items-center justify-center w-full h-full bg-black/50 fixed top-0 left-0 z-50">
            <div className="flex flex-col gap-5 border-white border-[1px] border-opacity-50 rounded-2xl bg-black bg-[radial-gradient(96%_98%_at_50%_100%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] w-1/5 h-[350px] p-[40px]">
                <div className="flex flex-col justify-between w-full h-full  text-white">
                    <div className="flex items-center justify-between w-full mb-5 relative">
                        <h1 className="text-3xl font-bold">{titulo}</h1>
                        <button onClick={onClose} className="text-white"><X size={30}/></button>
                    </div>
                    <div onSubmit={handleSesion} className="flex flex-col gap-10">
                        <div className="relative h-11 w-full  mb-3">
                            <input
                                placeholder={inputPlaceHolder}
                                id={inputName}
                                name={inputName}
                                type="text"
                                className="peer h-full w-full border-b border-white bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border-white focus:border-white focus:bg-transparent focus:outline-0 placeholder:opacity-0 focus:placeholder:opacity-100"
                                autoComplete="off"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                required
                            />
                            <label className='after:content[""] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-white transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-white after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-white peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:after:scale-x-100 peer-focus:after:border-white '>
                                {inputName}
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full gap-3">
                        <button onClick={handleSesion} className="text-base w-full text-black bg-white px-[10px] py-[6px] rounded-full transition-all duration-300 ease-in-out hover:opacity-50">{buttonName}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}