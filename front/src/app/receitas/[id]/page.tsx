"use client";

import { ArrowLeft, Clock, ChefHat, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { RecipeProps } from "@/types/RecipeProps";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState<RecipeProps>();

  useEffect(() => {
    fetch(`http://localhost:5000/api/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar receitas:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para receitas
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {recipe ? (
            <>
              <div className="relative h-[300px] md:h-[400px]">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                  {recipe.name}
                </h1>
                <p className="text-lg text-amber-700 mb-6">
                  {recipe.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-600 mb-2" />
                    <span className="text-sm text-amber-900 font-medium">
                      Tempo Total
                    </span>
                    <span className="text-amber-700">{recipe.duration}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                    <ChefHat className="h-6 w-6 text-amber-600 mb-2" />
                    <span className="text-sm text-amber-900 font-medium">
                      Dificuldade
                    </span>
                    <span className="text-amber-700">{recipe.difficulty}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                    <Users className="h-6 w-6 text-amber-600 mb-2" />
                    <span className="text-sm text-amber-900 font-medium">
                      Porções
                    </span>
                    <span className="text-amber-700">{recipe.servings}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-4">
                      Ingredientes
                    </h2>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mt-2 mr-2"></span>
                          <span className="text-amber-800">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-4">
                      Modo de Preparo
                    </h2>
                    <ol className="space-y-4">
                      {recipe.preparation_method.map((instruction, index) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-600 text-white text-sm font-medium mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-amber-800">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-3 text-center text-amber-600">
              <p>Não foi possível obter os dados da receita</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
