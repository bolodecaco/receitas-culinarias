export interface RecipeProps {
  id: number;
  created_at: string;
  description: string;
  difficulty: string;
  duration: string;
  ingredients: string[];
  name: string;
  preparation_method: string[];
  servings: string;
  image: string;
  category?: string;
}
