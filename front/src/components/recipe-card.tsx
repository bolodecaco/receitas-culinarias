import { Clock } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  title: string;
  description: string;
  time: string;
  difficulty: string;
  image: string;
  id: number;
}

export function RecipeCard({
  title,
  description,
  time,
  difficulty,
  image,
  id,
}: RecipeCardProps) {
  return (
    <Link href={`/receitas/${id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-3 right-3 bg-amber-600 hover:bg-amber-700">
            {difficulty}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-amber-900 mb-2">{title}</h3>
          <p className="text-amber-700 text-sm line-clamp-2 mb-3">
            {description}
          </p>
          <div className="flex items-center text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{time}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="text-amber-600 text-sm font-medium hover:underline">
            Ver receita completa
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
