using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("candidate_profiles")]
    public class CandidateProfile
    {
        [Key]
        [Column("candidate_id")]
        public int CandidateId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("full_name")]
        public string? FullName { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("resume_url")]
        public string? ResumeUrl { get; set; }
    }
}