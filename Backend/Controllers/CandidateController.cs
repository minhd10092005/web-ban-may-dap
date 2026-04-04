using Backend.Data;
using Backend.DTOs.CandidateProfile; // 1. Đã sửa namespace khớp với DTO
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
        private readonly AppDbContext _context;

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

            var profile = await _candidateRepo.GetProfileByUserIdAsync(userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId); // Giữ nguyên Model User.Id

            return Ok(new
            {
                Email = user?.Email,
                FullName = profile?.FullName,
                Phone = profile?.Phone,
                Address = profile?.Address,
                ResumeUrl = profile?.ResumeUrl
            });
        }

        [HttpPost("update-profile")]
        // 2. Dùng CandidateProfileUpdateDto cho đúng mục đích update
        public async Task<IActionResult> UpdateProfile([FromBody] CandidateProfileUpdateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            var newProfile = new CandidateProfile
            {
                UserId = userId,
                // 3. Đã sửa lại viết HOA cho khớp với DTO bro gửi
                FullName = dto.FullName,
                Phone = dto.Phone,
                Address = dto.Address,
                ResumeUrl = dto.ResumeUrl
            };

            await _candidateRepo.UpdateOrCreateProfileAsync(newProfile);
            return Ok(new { message = "Cập nhật hồ sơ thành công!" });
        }
    }
}