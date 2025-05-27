import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 bg-amber-900 text-amber-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sabores da Cozinha</h3>
            <p className="text-amber-200">
              Simulação de um site de receitas. Footer ilustrativo para fins de
              demonstração.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-amber-200 hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-200 hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-200 hover:text-white">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-amber-200 hover:text-white">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Siga-nos</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-amber-200 hover:text-white">
                Instagram
              </Link>
              <Link href="#" className="text-amber-200 hover:text-white">
                Facebook
              </Link>
              <Link href="#" className="text-amber-200 hover:text-white">
                Pinterest
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-800 mt-8 pt-6 text-center text-amber-300">
          <p>&copy; 2024 Sabores da Cozinha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
