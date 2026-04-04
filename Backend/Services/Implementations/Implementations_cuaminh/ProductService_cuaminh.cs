using Backend.DTOs.Product;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class ProductService_cuaminh : IProductService_cuaminh
    {
        private readonly IProductRepository_cuaminh _productRepository;

        public ProductService_cuaminh(IProductRepository_cuaminh productRepository)
        {
            _productRepository = productRepository;
        }

        // 1. Lấy danh sách (Dùng cho trang chủ/danh sách)
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(p => new ProductDto
            {
                ProductId = p.Id,
                ProductName = p.ProductName,
                ProductType = p.ProductType,
                CateId = p.ProductDetail?.Category?.CateId,
                CateName = p.ProductDetail?.Category?.CateName ?? "Chưa phân loại",
                // Lấy ảnh đầu tiên làm ảnh đại diện cho danh sách
                ImageUrl = p.ProductImages?.FirstOrDefault()?.ImageUrl
            }).ToList();
        }

        // 2. Lấy chi tiết (Dùng cho trang chi tiết có Slider 2s và Description)
        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            // Repository phải có .Include(p => p.ProductDetail).ThenInclude(pd => pd.Category)
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null) return null;

            return new ProductDto
            {
                ProductId = product.Id,
                ProductName = product.ProductName,
                ProductType = product.ProductType,
                CateId = product.ProductDetail?.Category?.CateId,
                CateName = product.ProductDetail?.Category?.CateName ?? "Chưa phân loại",

                // QUAN TRỌNG: Đổ dữ liệu Description từ bảng Detail vào DTO
                Description = product.ProductDetail?.Description,

                // QUAN TRỌNG: Đổ danh sách ảnh vào để Slider bên React có cái mà chạy
                ProductImages = product.ProductImages?.Select(img => new ProductImageDto
                {
                    ImageUrl = img.ImageUrl
                }).ToList()
            };
        }

        // 3. Tạo mới sản phẩm
        public async Task<ProductDto> CreateProductAsync(ProductCreateDto dto)
        {
            var newProduct = new Product
            {
                ProductName = dto.ProductName,
                ProductType = dto.ProductType,
                IsDeleted = false
            };

            var createdProduct = await _productRepository.CreateAsync(newProduct);

            return new ProductDto
            {
                ProductId = createdProduct.Id,
                ProductName = createdProduct.ProductName,
                ProductType = createdProduct.ProductType
            };
        }

        // 4. Cập nhật sản phẩm
        public async Task<bool> UpdateProductAsync(int id, ProductUpdateDto dto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null) return false;

            existingProduct.ProductName = dto.ProductName;
            existingProduct.ProductType = dto.ProductType;

            await _productRepository.UpdateAsync(existingProduct);
            return true;
        }

        // 5. Xóa sản phẩm
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return false;

            await _productRepository.DeleteAsync(product);
            return true;
        }

        public async Task<(IEnumerable<ProductDto> Items, int TotalCount)> GetPagedProductsAsync(string? search, int? cateId, int page, int pageSize)
        {
            // Gọi hàm có logic phân trang ở Repository (Tôi đã viết ở lượt trước)
            var (products, totalCount) = await _productRepository.GetAllPagedAsync(search, cateId, page, pageSize);

            var dtos = products.Select(p => new ProductDto
            {
                ProductId = p.Id,
                ProductName = p.ProductName,
                ProductType = p.ProductType,
                CateId = p.ProductDetail?.Category?.CateId,
                CateName = p.ProductDetail?.Category?.CateName ?? "Chưa phân loại",
                ImageUrl = p.ProductImages?.FirstOrDefault()?.ImageUrl
            });

            return (dtos, totalCount);
        }
    }
}