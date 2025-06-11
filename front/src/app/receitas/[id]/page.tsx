"use client";

import { ArrowLeft, ChefHat, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RecipeProps } from "@/types/RecipeProps";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// URL da imagem padrão
const DEFAULT_IMAGE =
  "https://cdn.pixabay.com/photo/2017/06/06/22/46/mediterranean-cuisine-2378758_1280.jpg";

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState<RecipeProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:5001/api/recipes/${recipeId}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar receita");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Erro ao buscar receita:", error);
        setError(
          "Não foi possível carregar a receita. Por favor, tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-amber-600">
            <p>Carregando receita...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
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
          <div className="text-center text-amber-600">
            <p>{error || "Receita não encontrada"}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src={recipe.image || DEFAULT_IMAGE}
              alt={recipe.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              {recipe.name}
            </h1>
            <p className="text-lg text-amber-700 mb-6">{recipe.description}</p>

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
                  {recipe.ingredients?.map((ingredient, index) => (
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
                  {recipe.preparation_method?.map((instruction, index) => (
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
