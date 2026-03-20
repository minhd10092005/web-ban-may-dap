using Backend.DTOs.Product;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Admin.Product
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductDto>> GetAllAsync()
        {
            return await _context.Products
                
                .Select(p => new ProductDto
                {
                    ProductId = p.Id,
                    ProductName = p.ProductName,
                    CateId = p.Category!.CateId,
                    CateName = p.Category.CateName
                }).ToListAsync();
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    ProductId = p.Id,
                    ProductName = p.ProductName,
                    CateId = p.Category!.CateId,
                    CateName = p.Category.CateName
                }).FirstOrDefaultAsync();
        }

        public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
        {

            var product = new Models.admin.Product
            {
                ProductName = dto.ProductName,
                
                ProductDetail = new Models.admin.ProductDetail
                {
                    CateId = dto.CateId
                }
                    
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return new ProductDto
            {
                ProductId = product.Id,
                ProductName = product.ProductName,
                CateId = product.Category!.CateId
            };


        }

        public async Task<bool> UpdateAsync(int id, ProductUpdateDto dto)
        {
           var product = await _context.Products.FindAsync(id);
           if (product == null) return false;

           product.ProductName = dto.ProductName;
           product.Category.CateId = dto.CateId;

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