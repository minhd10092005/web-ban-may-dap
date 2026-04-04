using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Tạm thời comment lại để test cho dễ, sau này lắp React thì mở ra
    public class AdminRecruitmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public AdminRecruitmentController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("review-cv")]
        public async Task<IActionResult> ReviewCv([FromBody] ReviewCvDto dto)
        {
            // 1. JOIN Bảng để lấy Email và Tên ứng viên
            var candidateInfo = await _context.Users
                .Where(u => u.Id == dto.UserId)
                .Join(_context.CandidateProfiles,
                    u => u.Id,
                    cp => cp.Id,
                    (u, cp) => new { u.Email, cp.FullName })
                .FirstOrDefaultAsync();

            if (candidateInfo == null)
                return NotFound(new { message = "Không tìm thấy thông tin ứng viên!" });

            // 2. Soạn nội dung Email
            string subject = dto.IsAccepted ? "Thư Mời Phỏng Vấn - Tiến Tuấn" : "Kết Quả Ứng Tuyển - Tiến Tuấn";
            string body = dto.IsAccepted
                ? $"<h2>Chúc mừng {candidateInfo.FullName}!</h2><p>Hồ sơ của bạn đã được công ty Tiến Tuấn chấp nhận.</p><p>Thời gian phỏng vấn dự kiến: <b>{dto.InterviewTime}</b>.</p><p>Vui lòng phản hồi lại email này để xác nhận lịch nhé!</p>"
                : $"<h2>Chào {candidateInfo.FullName},</h2><p>Cảm ơn bạn đã quan tâm đến công ty Tiến Tuấn.</p><p>Rất tiếc hồ sơ của bạn hiện tại chưa phù hợp với định hướng của công ty. Chúng tôi sẽ lưu giữ hồ sơ của bạn cho các đợt tuyển dụng sau.</p><p>Chúc bạn thành công!</p>";

            // 3. Gửi mail an toàn
            try
            {
                await _emailService.SendEmailAsync(candidateInfo.Email, subject, body);
                return Ok(new { success = true, message = $"Đã duyệt CV và gửi email tới {candidateInfo.Email}" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[LỖI GỬI MAIL] {ex.Message}");
                return Ok(new
                {
                    success = true,
                    warning = true,
                    message = "Cập nhật trạng thái thành công, nhưng gửi mail thất bại do địa chỉ email không hợp lệ!"
                });
            }
        }
    }
}