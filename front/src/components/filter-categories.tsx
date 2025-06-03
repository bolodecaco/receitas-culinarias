import { FiltersProps } from "@/types/FiltersProps";
import React from "react";
import { Button } from "./ui/button";

interface FilterCategoriesProps {
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  selected: string;
}

const categories = [
  { label: "Todas", value: "all" },
  { label: "Café da Manhã", value: "breakfast" },
  { label: "Almoço", value: "lunch" },
  { label: "Jantar", value: "dinner" },
  { label: "Sobremesas", value: "desserts" },
  { label: "Vegetarianas", value: "vegetarian" },
];

export function FilterCategories({
  setFilters,
  selected,
}: FilterCategoriesProps) {
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Categorias</h2>
      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant="outline"
            className={`rounded-full border-amber-200 hover:bg-amber-100 text-amber-900 ${
              selected === cat.value ? "bg-amber-100 border-amber-200" : ""
            }`}
            onClick={() =>
              setFilters({ category: cat.value as FiltersProps["category"] })
            }
          >
            {cat.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
