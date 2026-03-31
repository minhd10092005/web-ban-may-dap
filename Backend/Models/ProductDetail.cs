using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("product_details")]
    public class ProductDetail
    {
        [Key] // Trong EF Core cần có Key, ta tạm lấy ProductId làm Key vì quan hệ 1-1
        [Column("productid")]
        public int ProductId { get; set; }

        [Column("categoryid")]
        public int CategoryId { get; set; }

        [Column("description")]
        public string Description { get; set; }
    }
}