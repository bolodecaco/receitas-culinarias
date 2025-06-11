import os
import requests
from dotenv import load_dotenv
from typing import Dict, Optional
from src.interfaces.ImageServiceInterface import ImageServiceInterface

load_dotenv()

class PixabayService(ImageServiceInterface):
    def __init__(self):
        self.api_key = os.getenv("PIXABAY_API_KEY")
        if not self.api_key:
            raise ValueError("PIXABAY_API_KEY não está definido no ambiente.")
        self.base_url = "https://pixabay.com/api"

    def _score_image(self, hit: Dict) -> float:
        """
        Calcula uma pontuação para a imagem baseada em vários fatores.
        Pontuação mais alta significa que a imagem é mais adequada.
        """
        score = 0.0
        
        # Prefere imagens maiores
        width = hit.get('imageWidth', 0)
        height = hit.get('imageHeight', 0)
        if width > 0 and height > 0:
            score += (width * height) / 1000000  # Normaliza para megapixels
        
        # Prefere imagens com boa qualidade
        if hit.get('likes', 0) > 0:
            score += min(hit['likes'] / 100, 5)  # Máximo de 5 pontos por likes
        
        # Prefere imagens com boa proporção
        if width > 0 and height > 0:
            ratio = width / height
            if 1.5 <= ratio <= 2.5:  # Prefere proporções mais comuns para fotos de comida
                score += 1
        
        return score

    def search_image(self, query: str) -> Optional[str]:
        """
        Busca imagens no Pixabay baseada na query fornecida.
        Escolhe a melhor imagem baseada em critérios de qualidade.
        Retorna a URL da melhor imagem encontrada ou None se nenhuma for encontrada.
        """
        try:
            # Simplifica a query para usar apenas palavras-chave curtas
            words = query.lower().split()
            filtered_words = [w for w in words if len(w) > 3 and w not in ['com', 'para', 'como', 'fazer', 'receita', 'prato', 'pratos']]
            search_query = ' '.join(filtered_words[:2])
            
            print(f"\n[Pixabay] Query original: '{query}'")
            print(f"[Pixabay] Query simplificada: '{search_query}'")
            
            params = {
                "key": self.api_key,
                "q": search_query,
                "per_page": 5,
                "orientation": "horizontal",
                "category": "food",  # Foca em imagens de comida
                "safesearch": "true",
                "order": "popular"  # Prefere imagens populares
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if not data.get("hits"):
                print("[Pixabay] Nenhuma imagem encontrada")
                return None
            
            print(f"[Pixabay] Encontradas {len(data['hits'])} imagens")
            
            # Pontua e ordena as imagens
            scored_photos = [(hit, self._score_image(hit)) for hit in data["hits"]]
            scored_photos.sort(key=lambda x: x[1], reverse=True)
            
            # Mostra detalhes da melhor imagem
            best_photo = scored_photos[0][0]
            print(f"[Pixabay] Melhor imagem escolhida:")
            print(f"  - URL: {best_photo['largeImageURL']}")
            print(f"  - Usuário: {best_photo['user']}")
            print(f"  - Pontuação: {scored_photos[0][1]:.2f}")
            print(f"  - Dimensões: {best_photo['imageWidth']}x{best_photo['imageHeight']}")
            
            return best_photo["largeImageURL"]
            
        except Exception as e:
            print(f"[Pixabay] Erro ao buscar imagem: {str(e)}")
            return None 