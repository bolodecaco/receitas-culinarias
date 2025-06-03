"use client";

import { AIAssistant } from "@/components/ai-assistant";
import { FilterCategories } from "@/components/filter-categories";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiltersProps } from "@/types/FiltersProps";
import { RecipeProps } from "@/types/RecipeProps";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [filters, setFilters] = useState<FiltersProps>({ category: "all" });
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);

  useEffect(() => {
    const url =
      filters.category === "all"
        ? "http://localhost:5001/api/recipes/"
        : `http://localhost:5001/api/recipes/?category=${filters.category}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar receitas:", error);
      });
  }, [filters]);

  const filteredRecipes = recipes;

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Header />
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-amber-50 to-[#fffaf5]">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
            Descubra Sabores Incríveis
          </h1>
          <p className="text-lg md:text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
            Explore nossa coleção de receitas deliciosas e fáceis de preparar
            para todos os momentos
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar receitas..."
              className="pl-10 bg-white border-amber-200 focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </section>
      <section className="py-8 px-4">
        <FilterCategories setFilters={setFilters} selected={filters.category} />
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Receitas Populares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length ? (
              filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.name}
                  description={recipe.description}
                  time={recipe.duration}
                  difficulty={recipe.difficulty}
                  image={recipe.image}
                  id={recipe.id}
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-amber-600">
                <p>Nenhuma receita encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-amber-100 mt-12">
        <div className="container mx-auto text-center max-w-xl">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            Receba Novas Receitas
          </h2>
          <p className="text-amber-700 mb-6">
            Inscreva-se para receber nossas receitas mais recentes e dicas
            culinárias diretamente no seu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Seu melhor email"
              className="bg-white border-amber-200"
            />
            <Button className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap">
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>
      <AIAssistant />
      <Footer />
    </div>
  );
}
