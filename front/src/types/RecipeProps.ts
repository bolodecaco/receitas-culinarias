export interface RecipeProps {
  id: number;
  created_at: string;
  description: string;
  difficulty: string;
  duration: string;
  ingredients: string[];
  name: string;
  name_en: string;
  preparation_method: string[];
  servings: string;
  image: string | null;
  category?: string;
}
