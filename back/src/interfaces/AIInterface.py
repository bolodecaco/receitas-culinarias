from abc import ABC, abstractmethod

class AIInterface(ABC):
    
    @abstractmethod
    def generate_ai_response(self, prompt: str) -> str:
        pass