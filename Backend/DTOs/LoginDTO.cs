using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public string Password { get; set; }
    }
}