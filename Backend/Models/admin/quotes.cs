using System.ComponentModel.DataAnnotations;
namespace Backend.Models.admin
{

    public class Quote : EntityClass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [MaxLength(50)]
        public string State { get; set; } = string.Empty;

        [MaxLength(20)]
        public string PostalCode { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email Address is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [MaxLength(150)]
        public string EmailAddress { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Comments { get; set; } = string.Empty;

        public Quote(
            string fullName,
            string companyName,
            string address,
            string city,
            string state,
            string postalCode,
            string country,
            string emailAddress,
            string phone,
            string comments
        )
        {
            FullName = fullName;
            CompanyName = companyName;
            Address = address;
            City = city;
            State = state;
            PostalCode = postalCode;
            Country = country;
            EmailAddress = emailAddress;
            Phone = phone;
            Comments = comments;
        }

        protected Quote() { }
    }
}