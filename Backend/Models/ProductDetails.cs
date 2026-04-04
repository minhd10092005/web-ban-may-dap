using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("productdetails")]
    public class ProductDetail
    {
        [Key]
        [Column("ProductId")]
        public int ProductId { get; set; }

        // BÙA HỘ MỆNH Ở ĐÂY: Code có nhưng DB không có
        [NotMapped]
        public int Id { get; set; }

        public int? CateId { get; set; }

        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }

        [ForeignKey("CateId")]
        public virtual Category? Category { get; set; }
    }
}