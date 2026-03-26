using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Admin : EntityClass
    {
        [Key] public int Id { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        [MaxLength(50)]
        public string FullName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required] [MaxLength(20)] public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;


        // Constructor cho lập trình viên dùng
        public Admin(string fullName,string email, string phoneNumber, string passwordHash)
        {
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            PasswordHash = passwordHash;
        }

        // Constructor cho EF Core dùng 
        protected Admin()
        {
        }
    }
}