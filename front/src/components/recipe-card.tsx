import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface RecipeCardProps {
  title: string;
  description: string;
  time: string;
  difficulty: string;
  image: string | null;
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
  // URL da imagem padrão
  const defaultImage =
    "https://cdn.pixabay.com/photo/2017/06/06/22/46/mediterranean-cuisine-2378758_1280.jpg";

  return (
    <Link href={`/receitas/${id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={image || defaultImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
