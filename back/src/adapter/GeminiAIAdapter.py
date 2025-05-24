import os
import google.generativeai as genai
from src.interfaces.AIInterface import AIInterface
from dotenv import load_dotenv

load_dotenv()
class GeminiAIAdapter(AIInterface):
    def __init__(self, base_prompt: str, model: str = 'gemini-1.5-flash-8b') -> None:
        self._persona = base_prompt
        self._model = None

        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY não está definido no ambiente.")
        
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(model)

    def generate_ai_response(self, prompt: str) -> str:
        try:  
            res = self._model.generate_content(f"{self._persona}\n{prompt}").text
            return res 
        except Exception as e:
            return "Desculpe. Pensei errado."