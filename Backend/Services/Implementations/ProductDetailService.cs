using Backend.Data;
using Backend.DTOs.ProductDetail;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class ProductDetailService : IProductDetailService
    {
        private readonly AppDbContext _context;

        public ProductDetailService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductDetailDto>> GetAllAsync()
        {
            return await _context.ProductDetails
                .Select(pd => new ProductDetailDto
                {
                    ProductId = pd.ProductId,
                    ProductName = pd.Product!.ProductName,
                    CateId = pd.CateId,
                    CateName = pd.Category!.CateName,
                    Description = pd.Description
                }).ToListAsync();
        }



        public async Task<ProductDetailDto?> GetByIdAsync(int id)
        {
            return await _context.ProductDetails
                .Where(pd => pd.ProductId == id)
                .Select(pd => new ProductDetailDto
                {
                    ProductId = pd.ProductId,
                    ProductName = pd.Product.ProductName,
                    CateId = pd.CateId,
                    CateName = pd.Category.CateName,
                    Description = pd.Description
                }).FirstOrDefaultAsync();
        }

        public async Task<ProductDetailDto> CreateAsync(PrdDetailCreateDto dto)
        {
            var productDetail = new Models.ProductDetail
            {
                ProductId = dto.ProductId,
                CateId = dto.CateId,
                Description = dto.Description
            };

            _context.ProductDetails.Add(productDetail);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(productDetail.ProductId) ?? new ProductDetailDto();
        }

        public async Task<bool> UpdateAsync(int id ,PrdDetailUpdateDto dto)
        {
            var productDetail = await _context.ProductDetails.FindAsync(id);

            if (productDetail == null) return false;

            productDetail.CateId = dto.CateId;
            productDetail.Description = dto.Description;

            await _context.SaveChangesAsync();
            return true;
        }




        public async Task<bool> DeleteAsync(int id)
        {
            var productDetail = await _context.ProductDetails.FindAsync(id);
            if (productDetail == null) return false;

            _context.ProductDetails.Remove(productDetail);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}