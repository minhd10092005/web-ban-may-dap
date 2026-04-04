using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Product : EntityClass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ProductType { get; set; } = string.Empty;

        // --- KHÔNG ĐƯỢC CÓ Category HAY CateId Ở ĐÂY ---
        // Xóa dòng: public virtual Category? Category { get; set; } <--- THẰNG NÀY GÂY LỖI ĐẤY

        public virtual ProductDetail? ProductDetail { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        public Product() { }

        public Product(int id, string productName, string productType)
        {
            this.Id = id;
            this.ProductName = productName;
            this.ProductType = productType;
        }
    }
}