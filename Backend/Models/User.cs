using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{

    public class User : EntityClass
    {
        [Key]

        public int Id { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;



        // Constructor cho lập trình viên dùng
        public User(string email, string phoneNumber, string passwordHash)
        {
            Email = email;
            PhoneNumber = phoneNumber;
            PasswordHash = passwordHash;

        }

        // Constructor cho EF Core dùng 
        public User() { }
    }
}