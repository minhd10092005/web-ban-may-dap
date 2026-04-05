using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Net.Mail;
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
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IMemoryCache cache, IConfiguration config)
        {
            _context = context;
            _cache = cache;
            _config = config;
        }

        public class SendOtpDto { public string Email { get; set; } = null!; }
        public class RegisterOtpDto { public string Email { get; set; } = null!; public string Password { get; set; } = null!; public string Otp { get; set; } = null!; }
        public class LoginDto { public string Email { get; set; } = null!; public string Password { get; set; } = null!; }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "❌ Email này đã tồn tại trên hệ thống!" });

            string otp = new Random().Next(100000, 999999).ToString();
            _cache.Set(request.Email, otp, TimeSpan.FromMinutes(5));

            try
            {
                var senderEmail = _config["EmailSettings:SenderEmail"];
                var senderPassword = _config["EmailSettings:SenderPassword"];
                var senderName = _config["EmailSettings:SenderName"];

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true,
                };
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail!, senderName),
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

        [HttpPost("register")]
        public async Task<IActionResult> RegisterWithOtp([FromBody] RegisterOtpDto request)
        {
            if (!_cache.TryGetValue(request.Email, out string? savedOtp))
                return BadRequest(new { message = "❌ Mã OTP đã hết hạn hoặc chưa gửi!" });

            if (savedOtp != request.Otp)
                return BadRequest(new { message = "❌ Mã OTP không chính xác!" });

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            _cache.Remove(request.Email);

            return Ok(new { message = "✅ Đăng ký thành công!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "❌ Email hoặc mật khẩu không đúng!" });
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // 2. Gói gém thông tin của User vào Token
            // 2. Gói gém thông tin của User vào Token (Claims)
            var claims = new[]
            {
                // Thay user.Id thành user.UserId (Chữ U viết hoa nhé)
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, "Candidate")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                message = "✅ Đăng nhập thành công!",
                token = tokenString
            });
        }
    }
}