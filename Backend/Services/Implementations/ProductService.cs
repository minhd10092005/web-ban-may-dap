using Backend.DTOs.Product;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ProductDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, int? cateId = null)
        {
            var query = _context.Products
                .Include(p => p.ProductDetail)
                    .ThenInclude(pd => pd!.Category)
                .AsQueryable();

            // Lọc theo tên sản phẩm (case-insensitive)
            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(p => p.ProductName.Contains(searchTerm));

            // Lọc theo danh mục
            if (cateId.HasValue)
                query = query.Where(p => p.ProductDetail != null && p.ProductDetail.CateId == cateId.Value);

            var projected = query
                .OrderByDescending(p => p.Id)
                .Select(p => new ProductDto
                {
                    ProductId   = p.Id,
                    ProductName = p.ProductName,
                    ProductType = p.ProductType,
                    CateId      = p.ProductDetail != null ? p.ProductDetail.CateId : null,
                    CateName    = p.ProductDetail != null && p.ProductDetail.Category != null
                        ? p.ProductDetail.Category.CateName
                        : "Chưa phân loại"
                });

            return await projected.ToPagedListAsync(pageNumber, pageSize);
        }



        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    ProductId = p.Id,
                    ProductName = p.ProductName,
                    ProductType = p.ProductType,
                    CateId = p.ProductDetail != null ? p.ProductDetail.CateId : 0,
                    CateName = p.ProductDetail != null && p.ProductDetail.Category != null
                        ? p.ProductDetail.Category.CateName
                        : "Chưa phân loại"
                }).FirstOrDefaultAsync();
        }

        public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
        {
            var product = new Models.Product
            {
                ProductName = dto.ProductName,
                ProductType = dto.ProductType,
                ProductDetail = new Models.ProductDetail
                {
                    CateId = dto.CateId,
                    Description = "" // Tránh null cho cột description
                }
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return new ProductDto
            {
                ProductId = product.Id,
                ProductName = product.ProductName,
                ProductType = product.ProductType,
                CateId = product.ProductDetail.CateId
            };
        }

        public async Task<bool> UpdateAsync(int id, ProductUpdateDto dto)
        {
            var product = await _context.Products
                .Include(p => p.ProductDetail)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return false;

            product.ProductName = dto.ProductName;
            product.ProductType = dto.ProductType;

            if (product.ProductDetail != null)
            {
                product.ProductDetail.CateId = dto.CateId;
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}