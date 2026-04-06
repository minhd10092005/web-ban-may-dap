using Backend.DTOs.Admin;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api")] 
    [ApiController]
    public class AdminLoginController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminLoginController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("login")] 
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var result = await _adminService.AuthenticateAsync(dto);

            if (result == null)
                return BadRequest(new { message = "Email hoặc mật khẩu không chính xác" });

            return Ok(result);
        }
    }
}