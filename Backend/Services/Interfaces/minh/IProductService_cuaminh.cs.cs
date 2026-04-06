namespace Backend.Services.Interfaces.minh
{
    using Backend.DTOs.Product;

    public interface IProductService_cuaminh
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(ProductCreateDto dto);
        Task<bool> UpdateProductAsync(int id, ProductUpdateDto dto);
        Task<bool> DeleteProductAsync(int id);
        // Thay đổi kiểu trả về để có thêm thông tin TotalCount (Tổng số sản phẩm)
        Task<(IEnumerable<ProductDto> Items, int TotalCount)> GetPagedProductsAsync(string? search, int? cateId, int page, int pageSize);
    }
}