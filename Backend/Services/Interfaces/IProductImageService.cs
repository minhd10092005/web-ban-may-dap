using Backend.DTOs.Common;
using Backend.DTOs.ProductImage;

namespace Backend.Services.Interfaces
{
    public interface IProductImageService
    {
        Task<PagedResult<ProductImageDto>> GetAllAsync(
            int pageNumber,
            int pageSize,
            string? searchTerm = null,
            int? productId = null,
            string sortBy = "id",
            string sortDir = "desc");

        Task<ProductImageDto?> GetByIdAsync(int id);
        Task<ProductImageDto> CreateAsync(ProductImageCreateDto dto);
        Task<bool> UpdateAsync(int id, ProductImageUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
