using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductListDTO>> GetProducts()
        {
            return await _context.Products
                .Select(p => new ProductListDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    ModelNumber = p.ModelNumber
                })
                .ToListAsync();
        }

        public async Task<ProductDetailDTO> GetProductById(int id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDetailDTO
                {
                    Name = p.Name,
                    ModelNumber = p.ModelNumber,
                    Specs = _context.ProductSpecs
                        .Where(s => s.ProductId == p.Id)
                        .Select(s => new ProductSpecDTO
                        {
                            SpecName = s.SpecName,
                            SpecValue = s.SpecValue,
                            Unit = s.Unit
                        }).ToList()
                })
                .FirstOrDefaultAsync();

            return product;
        }
    }
}