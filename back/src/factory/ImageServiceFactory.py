from src.interfaces.ImageServiceInterface import ImageServiceInterface
from src.services.PexelsService import PexelsService
from src.services.PixabayService import PixabayService

class ImageServiceFactory:
    @staticmethod
    def get_image_service(service_type: str) -> ImageServiceInterface:
        """
        Retorna uma instância do serviço de imagem solicitado.
        
        Args:
            service_type: Tipo do serviço ('pexels' ou 'pixabay')
            
        Returns:
            Uma instância de ImageServiceInterface
            
        Raises:
            ValueError: Se o tipo de serviço não for suportado
        """
        if service_type.lower() == 'pexels':
            return PexelsService()
        elif service_type.lower() == 'pixabay':
            return PixabayService()
        else:
            raise ValueError(f"Serviço de imagem não suportado: {service_type}") 