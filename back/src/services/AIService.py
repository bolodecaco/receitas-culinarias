import json
import re
from src.factory.AIFactory import AIFactory
from src.services.DatabaseService import DatabaseService

class AIService:
    def __init__(self, model='gemini'):
        self.ai = AIFactory().get_ai(model)
        self.db_service = DatabaseService()

    def list_recipes(self):
        recipes = self.db_service.list_recipes()
        return recipes
    
    def generate_recipe(self, prompt):
        response = self.ai.generate_ai_response(prompt)
        recipe = self._parse_recipe(response)
        recipe_id = self.db_service.save_recipe(recipe)
        recipe['id'] = recipe_id
        return recipe
    
    def _parse_recipe(self, response):
        match = re.search(r'```json\n(.*?)\n```', response, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                raise ValueError("Erro ao decodificar JSON da resposta.")
        raise ValueError("Nenhum JSON válido encontrado na resposta.")
    
    def get_recipe(self, recipe_id):
        recipe = self.db_service.get_recipe(recipe_id)
        if not recipe:
            raise ValueError("Receita não encontrada.")
        return recipe
    
    def add_image(self, recipe_id, image_url):
        recipe = self.db_service.add_image(recipe_id, image_url)
        if not recipe:
            raise ValueError("Receita não encontrada.")
        return recipe
        