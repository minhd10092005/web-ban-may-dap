using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ProductRepository_cuaminh : IProductRepository_cuaminh
    {
        private readonly AppDbContext _context;
        public ProductRepository_cuaminh(AppDbContext context) { _context = context; }

        public async Task<(IEnumerable<Product> Items, int TotalCount)> GetAllPagedAsync(string? search, int? cateId, int page, int pageSize)
        {
            // Sử dụng AsNoTracking để query sạch nhất có thể
            var query = _context.Products
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Include(p => p.ProductDetail).ThenInclude(pd => pd.Category)
                .Include(p => p.ProductImages)
                .Where(p => !p.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.ProductName.Contains(search));

            if (cateId.HasValue)
                query = query.Where(p => p.ProductDetail.CateId == cateId);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Include(p => p.ProductImages)
                .Include(p => p.ProductDetail).ThenInclude(pd => pd.Category)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
        }

        // Các hàm CRUD khác giữ nguyên...
        public async Task<Product> CreateAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            product.IsDeleted = true;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Product>> GetRelatedProductsAsync(int cateId, int currentProductId)
        {
            return await _context.Products
                .IgnoreQueryFilters().AsNoTracking()
                .Include(p => p.ProductImages)
                .Where(p => p.ProductDetail.CateId == cateId && p.Id != currentProductId && !p.IsDeleted)
                .Take(4).ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products.IgnoreQueryFilters().Where(p => !p.IsDeleted).ToListAsync();
        }
    }
}