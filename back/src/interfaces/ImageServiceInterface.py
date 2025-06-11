from abc import ABC, abstractmethod
from typing import Optional

class ImageServiceInterface(ABC):
    @abstractmethod
    def search_image(self, query: str) -> Optional[str]:
        """
        Busca uma imagem baseada na query fornecida.
        Retorna a URL da imagem ou None se nenhuma for encontrada.
        """
        pass 