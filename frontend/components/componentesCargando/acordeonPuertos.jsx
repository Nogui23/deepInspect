import { Skeleton } from "@/components/ui/skeleton";


export default function AcordeonPuertos() {
    return(
        <div className="flex flex-row items-center justify-between w-full h-[84px] p-4 border border-white/20 rounded-xl overflow-hidden bg-white/10">
            <div className="flex flex-row items-center gap-4">
                <Skeleton className="h-[52px] w-[52px] rounded-full" />
                <div className="flex flex-col items-start justify-center gap-2">
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-4 w-52" />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <svg
                    className={'w-5 h-5 transform transition-transform'}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    )
}