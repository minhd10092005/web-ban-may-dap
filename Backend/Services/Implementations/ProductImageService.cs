using Backend.Data;
using Backend.DTOs.Common;
using Backend.DTOs.ProductImage;
using Backend.Extensions;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Implementations
{
    public class ProductImageService : IProductImageService
    {
        private readonly AppDbContext _context;

        public ProductImageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ProductImageDto>> GetAllAsync(
            int pageNumber,
            int pageSize,
            string? searchTerm = null,
            int? productId = null,
            string sortBy = "id",
            string sortDir = "desc")
        {
            var query = _context.ProductImages
                .Include(pi => pi.Product)
                .AsQueryable();

            // Tìm kiếm theo URL hoặc tên sản phẩm
            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(pi =>
                    pi.ImageUrl.Contains(searchTerm) ||
                    (pi.Product != null && pi.Product.ProductName.Contains(searchTerm)));

            // Lọc theo sản phẩm
            if (productId.HasValue)
                query = query.Where(pi => pi.ProductId == productId.Value);

            // Sắp xếp
            query = (sortBy.ToLower(), sortDir.ToLower()) switch
            {
                ("id",        "asc")  => query.OrderBy(pi => pi.Id),
                ("id",        _)      => query.OrderByDescending(pi => pi.Id),
                ("productid", "asc")  => query.OrderBy(pi => pi.ProductId),
                ("productid", _)      => query.OrderByDescending(pi => pi.ProductId),
                ("imageurl",  "asc")  => query.OrderBy(pi => pi.ImageUrl),
                ("imageurl",  _)      => query.OrderByDescending(pi => pi.ImageUrl),
                _                     => query.OrderByDescending(pi => pi.Id),
            };

            var projected = query.Select(pi => new ProductImageDto
            {
                Id          = pi.Id,
                ProductId   = pi.ProductId,
                ProductName = pi.Product != null ? pi.Product.ProductName : "—",
                ImageUrl    = pi.ImageUrl,
            });

            return await projected.ToPagedListAsync(pageNumber, pageSize);
        }

        public async Task<ProductImageDto?> GetByIdAsync(int id)
        {
            return await _context.ProductImages
                .Where(pi => pi.Id == id)
                .Select(pi => new ProductImageDto
                {
                    Id          = pi.Id,
                    ProductId   = pi.ProductId,
                    ProductName = pi.Product != null ? pi.Product.ProductName : "—",
                    ImageUrl    = pi.ImageUrl,
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ProductImageDto> CreateAsync(ProductImageCreateDto dto)
        {
            var image = new Models.ProductImage
            {
                ProductId = dto.ProductId,
                ImageUrl  = dto.ImageUrl.Trim(),
            };

            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(image.Id) ?? new ProductImageDto { Id = image.Id };
        }

        public async Task<bool> UpdateAsync(int id, ProductImageUpdateDto dto)
        {
            var image = await _context.ProductImages.FindAsync(id);
            if (image == null) return false;

            image.ImageUrl = dto.ImageUrl.Trim();

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var image = await _context.ProductImages.FindAsync(id);
            if (image == null) return false;

            image.IsDeleted = true;
            image.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
