using Backend.DTOs.ProductDetail;

namespace Backend.Services.Admin.ProductDetail
{
    public interface IProductDetailService
    {
        Task<List<ProductDetailDto>> GetAllAsync();
        Task<ProductDetailDto?> GetByIdAsync(int id);
        Task<ProductDetailDto> CreateAsync(PrdDetailCreateDto dto);
        Task<bool> UpdateAsync(int id,PrdDetailUpdateDto dto);
        Task<bool> DeleteAsync(int id);



    }
}