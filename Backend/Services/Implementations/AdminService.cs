using Backend.DTOs.Admin;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.Extensions;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AdminService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // =======================================================
        // QUẢN TRỊ DANH SÁCH (CRUD)
        // =======================================================

        public async Task<PagedResult<AdminDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
        {
            // Tối ưu: Chỉ lấy những Admin chưa bị xóa (IsDeleted = false)
            var query = _context.Admins.AsNoTracking().Where(a => !a.IsDeleted);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var search = searchTerm.ToLower();
                query = query.Where(a => a.FullName.ToLower().Contains(search) || a.Email.ToLower().Contains(search));
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
                .AsNoTracking()
                .Where(a => a.Id == id && !a.IsDeleted)
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
                BCrypt.Net.BCrypt.HashPassword(dto.Password) // Bảo mật: Hash mật khẩu ngay khi tạo
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
            if (admin == null || admin.IsDeleted) return false;

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

            admin.IsDeleted = true; // Thực hiện Soft Delete
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AdminLoginResponseDto?> AuthenticateAsync(AdminLoginDto dto)
        {
            // 1. Kiểm tra thông tin đăng nhập
            var admin = await _context.Admins
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Email.ToLower() == dto.Email.ToLower() && !a.IsDeleted);

            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
            {
                return null;
            }

            // 2. Tạo JWT Token
            var token = GenerateJwtToken(admin);

            // 3. Trả về Response hoàn chỉnh cho Frontend
            return new AdminLoginResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                Admin = new AdminDto
                {
                    Id = admin.Id,
                    FullName = admin.FullName,
                    Email = admin.Email,
                    PhoneNumber = admin.PhoneNumber
                }
            };
        }

        private string GenerateJwtToken(Models.Admin admin)
        {
            var jwtKey = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key is missing in appsettings.json");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                new Claim(ClaimTypes.Email, admin.Email),
                new Claim(ClaimTypes.Name, admin.FullName),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}