using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration; // Khai báo thêm cái này để đọc appsettings.json

        // Cập nhật lại Constructor
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request)
        {
            // ... (Đoạn code Register vẫn giữ nguyên như cũ) ...
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (userExists) return BadRequest(new { message = "Email này đã được sử dụng!" });

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // --- THÊM TÍNH NĂNG LOGIN VÀO ĐÂY ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            // --- 1. KIỂM TRA TRONG SỔ ADMIN TRƯỚC ---
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);
            if (admin != null)
            {
                bool isAdminPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash);
                if (!isAdminPasswordValid) return BadRequest(new { message = "Email hoặc mật khẩu không đúng!" });

                // Đúng là Admin -> Cấp Token có Role là "Admin"
                string token = GenerateJwtToken(admin.AdminId.ToString(), admin.Email, "Admin");
                return Ok(new { message = "Đăng nhập Admin thành công!", token = token });
            }

            // --- 2. NẾU KHÔNG PHẢI ADMIN, KIỂM TRA SỔ USERS (CANDIDATE) ---
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user != null)
            {
                bool isUserPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                if (!isUserPasswordValid) return BadRequest(new { message = "Email hoặc mật khẩu không đúng!" });

                // Đúng là Candidate -> Cấp Token có Role là "Candidate"
                string token = GenerateJwtToken(user.UserId.ToString(), user.Email, "Candidate");
                return Ok(new { message = "Đăng nhập Candidate thành công!", token = token });
            }

            // --- 3. KHÔNG CÓ TRONG CẢ 2 SỔ ---
            return BadRequest(new { message = "Email hoặc mật khẩu không đúng!" });
        }

        // ==========================================
        // HÀM HỖ TRỢ: CHUYÊN ĐÚC TOKENS MANG THEO ROLE
        // (Copy hàm này dán vào bên trong class AuthController, dưới hàm Login nhé)
        // ==========================================
        private string GenerateJwtToken(string id, string email, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, id),
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role) // NHÉT CHỨC VỤ VÀO ĐÂY!
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}