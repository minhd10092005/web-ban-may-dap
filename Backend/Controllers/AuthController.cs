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
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // --- THÊM TÍNH NĂNG LOGIN VÀO ĐÂY ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            // 1. Tìm user trong Database theo Email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Nếu không tìm thấy user
            if (user == null)
            {
                return BadRequest(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // 2. Dùng BCrypt để kiểm tra xem mật khẩu nhập vào có khớp với mã băm trong DB không
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return BadRequest(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // 3. Nếu đúng hết, bắt đầu tạo Token (Vé thông hành)
            var tokenHandler = new JwtSecurityTokenHandler();
            // Lấy chìa khóa từ appsettings.json
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Nhét thông tin của user vào Token
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token có hạn 7 ngày
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // 4. Trả về Token cho Frontend
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                token = tokenString
            });
        }
    }
}