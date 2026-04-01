using Backend.DTOs.Admin;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<AdminDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
        {
            var query = _context.Admins.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(a => a.FullName.Contains(searchTerm) || a.Email.Contains(searchTerm));
            }

            var projected = query
                .OrderByDescending(a => a.Id)
                .Select(a => new AdminDto
                {
                    Id = a.Id,
                    FullName = a.FullName,
                    Email = a.Email,
                    PhoneNumber = a.PhoneNumber
                });

            return await projected.ToPagedListAsync(pageNumber, pageSize);
        }

        public async Task<AdminDto?> GetByIdAsync(int id)
        {
            return await _context.Admins
                .Where(a => a.Id == id)
                .Select(a => new AdminDto
                {
                    Id = a.Id,
                    FullName = a.FullName,
                    Email = a.Email,
                    PhoneNumber = a.PhoneNumber
                }).FirstOrDefaultAsync();
        }

        public async Task<AdminDto> CreateAsync(AdminCreateDto dto)
        {
            var admin = new Models.Admin(
                dto.FullName, 
                dto.Email, 
                dto.PhoneNumber, 
                BCrypt.Net.BCrypt.HashPassword(dto.Password)
            );

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return new AdminDto
            {
                Id = admin.Id,
                FullName = admin.FullName,
                Email = admin.Email,
                PhoneNumber = admin.PhoneNumber
            };
        }

        public async Task<bool> UpdateAsync(int id, AdminUpdateDto dto)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null) return false;

            admin.FullName = dto.FullName;
            admin.Email = dto.Email;
            admin.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null) return false;

            admin.IsDeleted = true; // Soft Delete
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
