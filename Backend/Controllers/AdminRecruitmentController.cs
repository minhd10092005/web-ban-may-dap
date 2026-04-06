using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Services;
namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            // 1. JOIN đúng cột: User.Id khớp với CandidateProfile.UserId
            var candidateInfo = await _context.Users
                .Where(u => u.Id == dto.UserId)
                .Join(_context.CandidateProfiles,
                    u => u.Id,          
                    cp => cp.UserId,     
                    (u, cp) => new { u.Email, cp.FullName })
                .FirstOrDefaultAsync();

            if (candidateInfo == null)
            {
                return NotFound(new { 
                    success = false, 
                    message = $"Không tìm thấy hồ sơ ứng viên cho UserId: {dto.UserId}. Ứng viên cần cập nhật profile trước khi duyệt!" 
                });
            }

            // 2. Soạn nội dung Email
            string subject = dto.IsAccepted ? "Thư Mời Phỏng Vấn - Tiến Tuấn" : "Kết Quả Ứng Tuyển - Tiến Tuấn";
            string body = dto.IsAccepted
                ? $"<h2>Chúc mừng {candidateInfo.FullName}!</h2><p>Hồ sơ của bạn đã được chấp nhận.</p><p>Lịch phỏng vấn: <b>{dto.InterviewTime}</b>.</p>"
                : $"<h2>Chào {candidateInfo.FullName},</h2><p>Rất tiếc hồ sơ của bạn chưa phù hợp đợt này.</p>";

            // 3. Gửi mail
            try
            {
                await _emailService.SendEmailAsync(candidateInfo.Email, subject, body);
                return Ok(new { success = true, message = $"Đã duyệt và gửi mail tới {candidateInfo.Email}" });
            }
            catch (Exception ex)
            {
                return Ok(new { success = true, warning = true, message = "Duyệt thành công nhưng lỗi gửi mail!" });
            }
        }
    }
}