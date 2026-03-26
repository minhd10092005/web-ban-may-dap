using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ProductDetail
    {
        [Key] public int Id { get; set; }

        [Required] public int ProductId { get; set; }

        [Required] public int? CateId { get; set; }

        [StringLength(2000)] 
        public string Description { get; set; } = string.Empty;

        [ForeignKey("ProductId")] public virtual Product? Product { get; set; }

        [ForeignKey("CateId")] public virtual Category? Category { get; set; } // Phải có ông này!

    
        public ProductDetail()
        {
        }

      
        public ProductDetail(int productId, int cateId, string description)
        {
            this.ProductId = productId;
            this.CateId = cateId;
            this.Description = description;
        }
    }
}