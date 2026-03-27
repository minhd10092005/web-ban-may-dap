using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateRepository _candidateRepo;
        private readonly AppDbContext _context; // Đã thêm cửa vào Database

        // Đã cập nhật hàm tạo để nhận AppDbContext
        public CandidateController(ICandidateRepository candidateRepo, AppDbContext context)
        {
            _candidateRepo = candidateRepo;
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            // 1. Lấy hồ sơ từ bảng CandidateProfiles
            var profile = await _candidateRepo.GetProfileByUserIdAsync(userId);

            // 2. Lấy Email từ bảng Users (Cái này không đổi được nên lấy trực tiếp từ User)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            return Ok(new
            {
                email = user?.Email, // Trả email về đây
                full_name = profile?.FullName,
                phone = profile?.Phone,
                address = profile?.Address,
                resume_url = profile?.ResumeUrl
            });
        }

        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] CandidateProfileDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            var newProfile = new CandidateProfile
            {
                UserId = userId,
                FullName = dto.full_name,
                Phone = dto.phone,
                Address = dto.address,
                ResumeUrl = dto.resume_url
            };

            await _candidateRepo.UpdateOrCreateProfileAsync(newProfile);
            return Ok(new { message = "Cập nhật hồ sơ thành công!" });
        }
    }
}