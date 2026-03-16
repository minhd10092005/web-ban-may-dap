using Backend.DTOs;

namespace Backend.Repositories.Interfaces
{
    public interface IProductRepository
    {
        // Hàm mới dùng cho Tìm kiếm, Lọc và Phân trang
        Task<object> GetProductsAdvanced(string search, int? categoryId, int page, int pageSize);

        Task<ProductDetailDTO> GetProductById(int id);
    }
}