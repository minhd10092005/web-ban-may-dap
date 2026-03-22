using Backend.Data;
using Backend.DTOs.Category;

using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Admin.Category
{



    public class CateService : ICateService
    {
        private readonly AppDbContext _context;

        public CateService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CateDto>> GetAllAsync()
        {
            return await _context.Categories
                .Select(c => new CateDto
                {
                    CateId = c.CateId,
                    CateName = c.CateName
                }).ToListAsync();


        }

        public async Task<CateDto?> GetByIdAsync(int id)
        {
            return await _context.Categories
                .Where(c => c.CateId == id)
                .Select(c => new CateDto
                {
                    CateId = c.CateId,
                    CateName = c.CateName
                }).FirstOrDefaultAsync();
        }


        public async Task<CateDto> CreateAsync(CateCreateDto dto)
        {
            var category = new Models.admin.Category
            {
                CateName = dto.CateName
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CateDto
            {
                CateId = category.CateId,
                CateName = category.CateName
            };



        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}