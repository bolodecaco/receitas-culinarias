import { FiltersProps } from "@/types/FiltersProps";
import { Button } from "./ui/button";

interface FilterCategoriesProps {
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
}

export function FilterCategories({ setFilters }: FilterCategoriesProps) {
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Categorias</h2>
      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4">
        <Button
          variant="outline"
          className="rounded-full bg-amber-100 border-amber-200 hover:bg-amber-200 text-amber-900"
        >
          Todas
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900"
        >
          Café da Manhã
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900"
        >
          Almoço
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900"
        >
          Jantar
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900"
        >
          Sobremesas
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900"
        >
          Vegetarianas
        </Button>
      </div>
    </div>
  );
}
