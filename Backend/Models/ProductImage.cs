using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ProductImage : EntityClass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        // DÙNG NOTMAPPED: Để code C# vẫn thấy thuộc tính này (hết lỗi gạch đỏ)
        // Nhưng Entity Framework sẽ KHÔNG tìm cột này trong Database (hết lỗi SQL)
        [NotMapped]
        public new DateTime? DeletedAt { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}