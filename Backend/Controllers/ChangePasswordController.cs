using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize] // Bảo vệ API: Chỉ cho phép người dùng đã đăng nhập (có Token)
    [Route("api/[controller]")]
    [ApiController]
    public class ChangePasswordController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChangePasswordController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            // 1. NHẬN DIỆN NGƯỜI DÙNG TỪ TOKEN
            // Thử lấy ID theo chuẩn NameIdentifier (chuỗi dài) hoặc "id" thủ công
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                // Nếu vẫn không thấy, trả về lỗi kèm danh sách Claims để debug
                var claimsList = string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"));
                return Unauthorized(new
                {
                    message = "Không xác định được danh tính người dùng từ Token.",
                    debug_info = "Claims hiện có: " + claimsList
                });
            }

            // Chuyển đổi ID từ chuỗi sang số nguyên
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new { message = "Định dạng ID người dùng trong Token không hợp lệ." });
            }

            // Tìm người dùng trong Database
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Tài khoản không tồn tại trong hệ thống." });
            }

            // 2. KIỂM TRA MẬT KHẨU CŨ
            // Verify mật khẩu thô người dùng nhập với bản Hash trong DB
            bool isOldPasswordCorrect = BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash);
            if (!isOldPasswordCorrect)
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác. Vui lòng thử lại." });
            }

            // 3. CẬP NHẬT MẬT KHẨU MỚI
            // Hash mật khẩu mới trước khi lưu để đảm bảo an toàn
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "✅ Đổi mật khẩu thành công! Hãy dùng mật khẩu mới cho lần đăng nhập sau." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu mật khẩu.", error = ex.Message });
            }
        }
    }
}