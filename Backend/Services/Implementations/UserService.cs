using Backend.DTOs.User;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<UserDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
        {
            var query = _context.Users.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u => u.Email.Contains(searchTerm) || u.PhoneNumber.Contains(searchTerm));
            }

            var projected = query
                .OrderByDescending(u => u.Id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber
                });

            return await projected.ToPagedListAsync(pageNumber, pageSize);
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber
                }).FirstOrDefaultAsync();
        }

        public async Task<UserDto> CreateAsync(UserCreateDto dto)
        {
            var user = new Models.User(
                dto.Email, 
                dto.PhoneNumber, 
                BCrypt.Net.BCrypt.HashPassword(dto.Password)
            );

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };
        }

        public async Task<bool> UpdateAsync(int id, UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.Email = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsDeleted = true; // Soft Delete
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
