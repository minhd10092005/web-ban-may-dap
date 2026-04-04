using Backend.Models;

namespace Backend.Repositories
{
    public interface IProductRepository_cuaminh
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Product product);
        Task<IEnumerable<Product>> GetRelatedProductsAsync(int cateId, int currentProductId);

        // Hàm phân trang trả về Tuple (Danh sách + Tổng số lượng)
        Task<(IEnumerable<Product> Items, int TotalCount)> GetAllPagedAsync(string? search, int? cateId, int page, int pageSize);
    }
}