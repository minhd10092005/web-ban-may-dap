using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.CandidateProfile
{
    public class CandidateProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty; // Từ User
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CandidateProfileCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Full Name is required")]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(300)]
        public string ResumeUrl { get; set; } = string.Empty;
    }

    public class CandidateProfileUpdateDto
    {
        [Required(ErrorMessage = "Full Name is required")]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(300)]
        public string ResumeUrl { get; set; } = string.Empty;
    }
}
