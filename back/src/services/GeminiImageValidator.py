import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Tuple
from src.interfaces.ImageValidationInterface import ImageValidationInterface

load_dotenv()

class GeminiImageValidator(ImageValidationInterface):
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY não está definido no ambiente.")
        
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel('gemini-1.5-flash')
        
        self._base_prompt = """
        Você é um especialista em análise de imagens de comida.
        Sua tarefa é analisar uma imagem e determinar se ela corresponde a uma receita específica.
        
        Analise a imagem considerando:
        1. Se a comida na imagem corresponde à receita descrita
        2. A qualidade e apresentação da imagem
        3. Se a imagem é apropriada para um site de receitas
        
        Responda em formato JSON:
        {
            "is_valid": true/false,
            "score": 0.0 a 1.0,
            "explanation": "explicação detalhada da sua análise"
        }
        
        Regras:
        - Score 0.0: Imagem completamente irrelevante ou inapropriada
        - Score 0.5: Imagem parcialmente relevante ou qualidade média
        - Score 1.0: Imagem perfeita para a receita
        - is_valid deve ser true apenas se score >= 0.7
        """

    def _download_image(self, url: str) -> bytes:
        """Baixa a imagem da URL e retorna os bytes."""
        response = requests.get(url)
        response.raise_for_status()
        return response.content

    def validate_image(self, image_url: str, recipe_name: str, recipe_description: str) -> Tuple[bool, float, str]:
        """
        Valida se uma imagem corresponde à receita usando o Gemini Vision.
        """
        try:
            print(f"\n[GeminiValidator] Validando imagem para receita: {recipe_name}")
            print(f"[GeminiValidator] URL da imagem: {image_url}")
            
            # Baixa a imagem
            image_data = self._download_image(image_url)
            
            # Prepara o prompt com o contexto da receita
            prompt = f"""
            {self._base_prompt}
            
            Receita: {recipe_name}
            Descrição: {recipe_description}
            
            Analise a imagem e determine se ela é adequada para esta receita.
            """
            
            # Faz a requisição para o Gemini Vision com o formato correto
            response = self._model.generate_content([
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": image_data
                            }
                        }
                    ]
                }
            ])
            
            # Extrai a resposta JSON
            import json
            import re
            
            # Procura por um bloco JSON na resposta
            json_match = re.search(r'```json\n(.*?)\n```', response.text, re.DOTALL)
            if not json_match:
                # Se não encontrar um bloco JSON, tenta parsear a resposta inteira
                try:
                    result = json.loads(response.text)
                except:
                    print("[GeminiValidator] Erro ao parsear resposta do Gemini")
                    return False, 0.0, "Erro ao analisar imagem"
            else:
                result = json.loads(json_match.group(1))
            
            is_valid = result.get('is_valid', False)
            score = float(result.get('score', 0.0))
            explanation = result.get('explanation', 'Sem explicação')
            
            print(f"[GeminiValidator] Resultado:")
            print(f"  - Válida: {is_valid}")
            print(f"  - Score: {score:.2f}")
            print(f"  - Explicação: {explanation}")
            
            return is_valid, score, explanation
            
        except Exception as e:
            print(f"[GeminiValidator] Erro ao validar imagem: {str(e)}")
            return False, 0.0, f"Erro ao validar imagem: {str(e)}" 