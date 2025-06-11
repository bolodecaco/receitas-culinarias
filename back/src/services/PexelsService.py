import os
import requests
from dotenv import load_dotenv
from typing import Dict, Optional
from src.interfaces.ImageServiceInterface import ImageServiceInterface

load_dotenv()

class PexelsService(ImageServiceInterface):
    def __init__(self):
        self.api_key = os.getenv("PEXELS_API_KEY")
        if not self.api_key:
            raise ValueError("PEXELS_API_KEY não está definido no ambiente.")
        self.base_url = "https://api.pexels.com/v1"
        self.headers = {
            "Authorization": self.api_key
        }

    def _score_image(self, photo: Dict) -> float:
        """
        Calcula uma pontuação para a imagem baseada em vários fatores.
        Pontuação mais alta significa que a imagem é mais adequada.
        """
        score = 0.0
        
        width = photo.get('width', 0)
        height = photo.get('height', 0)
        if width > 0 and height > 0:
            score += (width * height) / 1000000 
        
        if photo.get('avg_color'):
            r, g, b = [int(photo['avg_color'][i:i+2], 16) for i in (1, 3, 5)]
            brightness = (r + g + b) / 3
            if 30 <= brightness <= 225: 
                score += 1
        
        if width > 0 and height > 0:
            ratio = width / height
            if 1.5 <= ratio <= 2.5:  
                score += 1
        
        return score

    def search_image(self, query: str) -> Optional[str]:
        """
        Busca imagens no Pexels baseada na query fornecida.
        Escolhe a melhor imagem baseada em critérios de qualidade.
        Retorna a URL da melhor imagem encontrada ou None se nenhuma for encontrada.
        """
        try:
            
            words = query.lower().split()
            filtered_words = [w for w in words if len(w) > 3 and w not in ['com', 'para', 'como', 'fazer', 'receita', 'prato', 'pratos']]
            search_query = ' '.join(filtered_words[:2])
            
            print(f"\n[Pexels] Query original: '{query}'")
            print(f"[Pexels] Query simplificada: '{search_query}'")
            
            search_url = f"{self.base_url}/search"
            params = {
                "query": search_query,
                "per_page": 5,
                "orientation": "landscape"
            }
            
            response = requests.get(search_url, headers=self.headers, params=params)
            response.raise_for_status()
            
            data = response.json()
            if not data["photos"]:
                print("[Pexels] Nenhuma imagem encontrada")
                return None
            
            print(f"[Pexels] Encontradas {len(data['photos'])} imagens")
            
            scored_photos = [(photo, self._score_image(photo)) for photo in data["photos"]]
            scored_photos.sort(key=lambda x: x[1], reverse=True)
            
            best_photo = scored_photos[0][0]
            print(f"[Pexels] Melhor imagem escolhida:")
            print(f"  - URL: {best_photo['src']['large']}")
            print(f"  - Fotógrafo: {best_photo['photographer']}")
            print(f"  - Pontuação: {scored_photos[0][1]:.2f}")
            print(f"  - Dimensões: {best_photo['width']}x{best_photo['height']}")
            
            return best_photo["src"]["large"]
            
        except Exception as e:
            print(f"[Pexels] Erro ao buscar imagem: {str(e)}")
            return None 