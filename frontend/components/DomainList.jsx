"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "./ui/skeleton"

export default function DomainList({ domains = [], type = "dominios", cargando = false }) {
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(domains.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = domains.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {type === "dominios" ? "Dominios" : "Subdominios"}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Mostrar:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[100px] bg-transparent border-white/20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {cargando ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 10}).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-white/20 bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)]"
              >
                <Skeleton className="w-3/4 h-5"/>
                <Skeleton className="w-6 h-6"/>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="w-48 h-5 bg-white/10 animate-pulse rounded"></div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <div className="w-8 h-8 bg-white/10 animate-pulse rounded-md mx-1"></div>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext href="#" className="pointer-events-none opacity-50" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((domain, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-white/20 bg-[radial-gradient(139%_78%_at_0%_0%,_rgb(38,_38,_38)_0%,_rgba(0,_3,_15,_0)_100%)] hover:border-white/40 transition-all duration-300"
              >
                <span className="font-medium">{domain}</span>
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-white/70">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, domains.length)} de {domains.length}
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) paginate(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {pageNumbers.map((number) => {
                    if (
                      number === 1 ||
                      number === totalPages ||
                      (number >= currentPage - 1 && number <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={number}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              paginate(number)
                            }}
                            isActive={currentPage === number}
                            className={currentPage === number ? "bg-white text-black hover:bg-white/70" : ""}
                          >
                            {number}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                    if (
                      (number === 2 && currentPage > 3) ||
                      (number === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={number}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) paginate(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}