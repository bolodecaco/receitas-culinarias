from abc import ABC, abstractmethod
from typing import Tuple

class ImageValidationInterface(ABC):
    @abstractmethod
    def validate_image(self, image_url: str, recipe_name: str, recipe_description: str) -> Tuple[bool, float, str]:
        """
        Valida se uma imagem corresponde à receita.
        
        Args:
            image_url: URL da imagem a ser validada
            recipe_name: Nome da receita
            recipe_description: Descrição da receita
            
        Returns:
            Tuple contendo:
            - bool: Se a imagem é válida
            - float: Score de relevância (0-1)
            - str: Explicação da validação
        """
        pass 