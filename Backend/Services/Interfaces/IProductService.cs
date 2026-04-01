using Backend.DTOs.Common;
using Backend.DTOs.Product;

namespace Backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<PagedResult<ProductDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, int? cateId = null);
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(ProductCreateDto dto);
        Task<bool> UpdateAsync(int id, ProductUpdateDto dto);
        Task<bool> DeleteAsync(int id);

    }

    

}