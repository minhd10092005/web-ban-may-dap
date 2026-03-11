using Backend.DTOs;

namespace Backend.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<ProductListDTO>> GetProducts();

        Task<ProductDetailDTO> GetProductById(int id);
    }
}