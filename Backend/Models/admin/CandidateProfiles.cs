using System.ComponentModel.DataAnnotations;

namespace Backend.Models.admin
{
    public class CandidateProfile : EntityClass
    {
        [Key] public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
        [Required] [MaxLength(100)] public string FullName { get; set; } = string.Empty;

        [MaxLength(20)] public string Phone { get; set; } = string.Empty;

        [MaxLength(200)] public string Address { get; set; } = string.Empty;

        [MaxLength(300)] public string ResumeUrl { get; set; } = string.Empty;


        public CandidateProfile(
            int id,
            int userId,
            User user,
            string fullName,
            string phone,
            string address,
            string resumeUrl
        )
        {
            Id = id;
            UserId = userId;
            User = user;
            FullName = fullName;
            Phone = phone;
            Address = address;
            ResumeUrl = resumeUrl;
        }

        protected CandidateProfile()
        {
        }
    }
}