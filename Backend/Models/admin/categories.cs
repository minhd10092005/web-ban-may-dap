using System.ComponentModel.DataAnnotations;

namespace Backend.Models.admin
{
    public class Category : EntityClass
    {
        [Key] public int? CateId { get; set; }

        [Required] [MaxLength(50)] public string CateName { get; set; } = string.Empty;
        public virtual ICollection<ProductDetail> ProductDetails { get; set; } = new List<ProductDetail>();

        public Category(int cateId, string cateName)
        {
            this.CateId = cateId;
            this.CateName = cateName;
        }

        public Category()
        {
        }
    }
}