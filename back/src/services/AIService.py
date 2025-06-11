import json
import re
from src.factory.AIFactory import AIFactory
from src.factory.ImageServiceFactory import ImageServiceFactory
from src.services.DatabaseService import DatabaseService
from src.services.GeminiImageValidator import GeminiImageValidator

class AIService:
    # URL da imagem padrão (uma imagem genérica de "no image" ou "placeholder")
    DEFAULT_IMAGE_URL = "https://cdn.pixabay.com/photo/2017/06/06/22/46/mediterranean-cuisine-2378758_1280.jpg"

    def __init__(self, model='gemini'):
        self.ai = AIFactory().get_ai(model)
        self.db_service = DatabaseService()
        self.image_validator = GeminiImageValidator()
        # Lista de serviços de imagem para tentar em ordem
        self.image_services = ['pexels', 'pixabay']
        # Configurações de validação
        self.min_image_score = 0.7  # Score mínimo para aceitar uma imagem
        self.max_validation_attempts = 3  # Número máximo de tentativas por serviço

    def _build_image_search_query(self, recipe):
        """Constrói uma query mais específica para busca de imagens baseada nos detalhes da receita."""
        # Extrai palavras-chave relevantes da descrição
        description_keywords = []
        if recipe.get('description'):
            # Remove palavras comuns e mantém apenas palavras relevantes
            words = recipe['description'].lower().split()
            description_keywords = [w for w in words if len(w) > 3 and w not in ['para', 'com', 'uma', 'como', 'mais', 'muito', 'pouco', 'bem', 'muito', 'pouco', 'bem', 'mais', 'menos', 'tudo', 'nada', 'todos', 'todas', 'cada', 'qual', 'quem', 'onde', 'quando', 'como', 'porque', 'porque', 'então', 'assim', 'também', 'ainda', 'já', 'sempre', 'nunca', 'agora', 'antes', 'depois', 'hoje', 'amanhã', 'ontem', 'sempre', 'nunca', 'agora', 'antes', 'depois', 'hoje', 'amanhã', 'ontem']]
            description_keywords = list(set(description_keywords))[:5]  # Limita a 5 palavras-chave únicas

        # Constrói a query principal
        query_parts = [recipe['name_en']]  # Começa com o nome em inglês
        
        # Adiciona categoria se disponível
        if recipe.get('category'):
            query_parts.append(recipe['category'])
        
        # Adiciona palavras-chave da descrição
        if description_keywords:
            query_parts.extend(description_keywords)
        
        # Adiciona ingredientes principais (primeiros 2)
        if recipe.get('ingredients'):
            main_ingredients = [ing.split()[0] for ing in recipe['ingredients'][:2]]  # Pega o primeiro ingrediente de cada
            query_parts.extend(main_ingredients)
        
        # Adiciona termos específicos baseados na dificuldade
        difficulty_terms = {
            'Fácil': 'simple',
            'Médio': 'traditional',
            'Difícil': 'gourmet'
        }
        if recipe.get('difficulty') in difficulty_terms:
            query_parts.append(difficulty_terms[recipe['difficulty']])
        
        # Adiciona termos específicos para melhorar a qualidade da imagem
        query_parts.extend(['food', 'dish', 'plate', 'professional'])
        
        # Remove duplicatas e junta tudo
        query = ' '.join(list(dict.fromkeys(query_parts)))
        print(f"[AIService] Query de busca de imagem construída: {query}")
        return query

    def list_recipes(self):
        recipes = self.db_service.list_recipes()
        return recipes
    
    def generate_recipe(self, prompt):
        print(f"\n[AIService] Gerando receita com prompt: '{prompt}'")
        try:
            response = self.ai.generate_ai_response(prompt)
            print(f"[AIService] Resposta do AI:\n{response}")
            
            recipe = self._parse_recipe(response)
            print(f"[AIService] Receita parseada: {json.dumps(recipe, indent=2, ensure_ascii=False)}")
            
            # Constrói a query de busca de imagem
            image_search_query = self._build_image_search_query(recipe)
            
            # Variáveis para armazenar a melhor imagem encontrada
            best_image = None
            best_score = 0
            best_explanation = ""
            
            # Tenta buscar imagem em diferentes serviços
            recipe['image'] = None
            for service_name in self.image_services:
                try:
                    print(f"\n[AIService] Tentando buscar imagem no serviço: {service_name}")
                    image_service = ImageServiceFactory.get_image_service(service_name)
                    
                    # Tenta encontrar uma imagem válida
                    for attempt in range(self.max_validation_attempts):
                        image_url = image_service.search_image(image_search_query)
                        if not image_url:
                            print(f"[AIService] Nenhuma imagem encontrada no {service_name} (tentativa {attempt + 1})")
                            break
                            
                        # Valida a imagem com o Gemini
                        is_valid, score, explanation = self.image_validator.validate_image(
                            image_url,
                            recipe['name'],
                            recipe['description']
                        )
                        
                        # Atualiza a melhor imagem se encontrar uma com score maior
                        if score > best_score:
                            best_image = image_url
                            best_score = score
                            best_explanation = explanation
                            print(f"[AIService] Nova melhor imagem encontrada:")
                            print(f"  - Score: {score:.2f}")
                            print(f"  - Explicação: {explanation}")
                        
                        if is_valid and score >= self.min_image_score:
                            recipe['image'] = image_url
                            print(f"[AIService] Imagem válida encontrada no {service_name}:")
                            print(f"  - Score: {score:.2f}")
                            print(f"  - Explicação: {explanation}")
                            break
                        else:
                            print(f"[AIService] Imagem rejeitada (tentativa {attempt + 1}):")
                            print(f"  - Score: {score:.2f}")
                            print(f"  - Explicação: {explanation}")
                    
                    if recipe['image']:
                        break
                        
                except Exception as e:
                    print(f"[AIService] Erro ao buscar imagem no {service_name}: {str(e)}")
                    continue
            
            # Se não encontrou uma imagem válida, usa a melhor imagem encontrada
            if not recipe['image'] and best_image:
                print(f"[AIService] Usando a melhor imagem encontrada (score: {best_score:.2f}):")
                print(f"  - Explicação: {best_explanation}")
                recipe['image'] = best_image
            elif not recipe['image']:
                print("[AIService] Nenhuma imagem encontrada, usando imagem padrão")
                recipe['image'] = self.DEFAULT_IMAGE_URL
            
            recipe_id = self.db_service.save_recipe(recipe)
            recipe['id'] = recipe_id
            print(f"[AIService] Receita salva com ID: {recipe_id}")
            return recipe
            
        except Exception as e:
            print(f"[AIService] Erro ao gerar receita: {str(e)}")
            raise ValueError(f"Erro ao gerar receita: {str(e)}")
    
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
        