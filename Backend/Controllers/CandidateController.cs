using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.Models;
using Backend.DTOs;
using Backend.Repositories.Interfaces;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Bắt buộc phải có Token
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateRepository _candidateRepo;

        public CandidateController(ICandidateRepository candidateRepo)
        {
            _candidateRepo = candidateRepo;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { message = "Token không hợp lệ." });

            var profile = await _candidateRepo.GetProfileByUserIdAsync(userId);

            if (profile == null) return Ok(new { }); // Trả về rỗng nếu chưa có hồ sơ

            return Ok(new
            {
                full_name = profile.FullName,
                phone = profile.Phone,
                address = profile.Address,
                resume_url = profile.ResumeUrl
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