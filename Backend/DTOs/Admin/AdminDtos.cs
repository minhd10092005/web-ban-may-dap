using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Admin
{
    public class AdminDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }

    public class AdminCreateDto
    {
        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(50)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MaxLength(100)]
        public string Password { get; set; } = string.Empty;
    }

    public class AdminUpdateDto
    {
        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(50)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        // Chỉ cập nhật mật khẩu nếu không rỗng
        [MaxLength(100)]
        public string? Password { get; set; } 
    }
    
    public class AdminLoginDto
    {
       

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;
  
        [MaxLength(100)]
        public string? Password { get; set; } 
    }
    public class AdminLoginResponseDto
    {
      
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public AdminDto Admin { get; set; } = null!;
    }
}
