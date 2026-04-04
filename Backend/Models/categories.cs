using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Category : EntityClass
    {
        [Key]
        public int? CateId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CateName { get; set; } = string.Empty;

        // Chặn EF Core tìm cột này trong DB categories
        [NotMapped]
        public new DateTime? DeletedAt { get; set; }

        public Category(int cateId, string cateName)
        {
            this.CateId = cateId;
            this.CateName = cateName;
        }

        public Category() { }
    }
}