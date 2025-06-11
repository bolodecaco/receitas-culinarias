import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-semibold text-amber-900 hover:text-amber-700"
                >
                  Início
                </Link>
                <Link
                  href="#"
                  className="text-lg font-semibold text-amber-900 hover:text-amber-700"
                >
                  Categorias
                </Link>
                <Link
                  href="#"
                  className="text-lg font-semibold text-amber-900 hover:text-amber-700"
                >
                  Mais Recentes
                </Link>
                <Link
                  href="#"
                  className="text-lg font-semibold text-amber-900 hover:text-amber-700"
                >
                  Populares
                </Link>
                <Link
                  href="#"
                  className="text-lg font-semibold text-amber-900 hover:text-amber-700"
                >
                  Sobre Nós
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-600">
              Sabores da Cozinha
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-amber-900 font-medium hover:text-amber-600"
          >
            Início
          </Link>
          <Link
            href="#"
            className="text-amber-900 font-medium hover:text-amber-600"
          >
            Categorias
          </Link>
          <Link
            href="#"
            className="text-amber-900 font-medium hover:text-amber-600"
          >
            Mais Recentes
          </Link>
          <Link
            href="#"
            className="text-amber-900 font-medium hover:text-amber-600"
          >
            Populares
          </Link>
          <Link
            href="#"
            className="text-amber-900 font-medium hover:text-amber-600"
          >
            Sobre Nós
          </Link>
        </nav>

        {/* <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-amber-900">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-amber-900">
            <User className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </Button>
          <Button className="hidden md:flex bg-amber-600 hover:bg-amber-700 text-white">Entrar</Button>
        </div> */}
      </div>
    </header>
  );
}
