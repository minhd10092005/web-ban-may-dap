using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Net.Mail;
// 4 thư viện mới thêm vào để làm Token:
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config; // Dùng để đọc appsettings.json

        // Cập nhật lại Constructor để nhận thêm IConfiguration
        public AuthController(AppDbContext context, IMemoryCache cache, IConfiguration config)
        {
            _context = context;
            _cache = cache;
            _config = config;
        }

        public class SendOtpDto { public string Email { get; set; } }
        public class RegisterOtpDto { public string Email { get; set; } public string Password { get; set; } public string Otp { get; set; } }
        public class LoginDto { public string Email { get; set; } public string Password { get; set; } }

        // =====================================
        // API 1: GỬI MÃ OTP VỀ EMAIL (Giữ nguyên)
        // =====================================
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "❌ Email này đã tồn tại trên hệ thống!" });

            string otp = new Random().Next(100000, 999999).ToString();
            _cache.Set(request.Email, otp, TimeSpan.FromMinutes(5));

            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("quocprodad@gmail.com", "opneivmxzaialeme"),
                    EnableSsl = true,
                };
                var mailMessage = new MailMessage
                {
                    From = new MailAddress("quocprodad@gmail.com", "Hệ thống Tuyển Dụng"),
                    Subject = "Mã xác nhận đăng ký tài khoản",
                    Body = $"<h3>Chào bạn,</h3><p>Mã xác nhận (OTP) của bạn là: <b><span style='font-size:24px;color:blue;'>{otp}</span></b></p>",
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(request.Email);
                await smtpClient.SendMailAsync(mailMessage);
                return Ok(new { message = "✅ Mã OTP đã được gửi đến email của bạn!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "❌ Lỗi hệ thống: " + ex.Message });
            }
        }

        // =====================================
        // API 2: XÁC NHẬN OTP & TẠO TÀI KHOẢN (Giữ nguyên)
        // =====================================
        [HttpPost("register")]
        public async Task<IActionResult> RegisterWithOtp([FromBody] RegisterOtpDto request)
        {
            if (!_cache.TryGetValue(request.Email, out string savedOtp))
                return BadRequest(new { message = "❌ Mã OTP đã hết hạn hoặc chưa gửi!" });

            if (savedOtp != request.Otp)
                return BadRequest(new { message = "❌ Mã OTP không chính xác!" });

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.Now
                // Nếu User của bạn có cột Role, bạn có thể gán mặc định ở đây: Role = "Candidate"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            _cache.Remove(request.Email);

            return Ok(new { message = "✅ Đăng ký thành công!" });
        }

        // =====================================
        // API 3: ĐĂNG NHẬP VÀ CẤP TOKEN JWT
        // =====================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "❌ Email hoặc mật khẩu không đúng!" });
            }

            // --- QUÁ TRÌNH TẠO TOKEN BẮT ĐẦU TỪ ĐÂY ---
            // 1. Lấy chìa khóa bí mật từ appsettings.json
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // 2. Gói gém thông tin của User vào Token (Gọi là Claims)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                // Gắn quyền cho User (Phục vụ cho hàm jwtDecode bên React)
                // Hiện tại ta gán cứng là Candidate. Sau này nếu DB có cột Quyền thì thay bằng user.Role nhé
                new Claim(ClaimTypes.Role, "Candidate")
            };

            // 3. Tiến hành đóng dấu và xuất xưởng Token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2), // Thẻ có hạn 2 tiếng
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // 4. Trả Token về cho React
            return Ok(new
            {
                message = "✅ Đăng nhập thành công!",
                token = tokenString // 👈 React đang chờ cái này đây!
            });
        }
    }
}