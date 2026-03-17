using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public int Id { get; set; }

        [Column("product_name")]
        public string Name { get; set; }

        // SQL của bạn dùng image_url, nên C# phải khai báo tương ứng
        [Column("image_url")]
        public string ImageUrl { get; set; }

        // SQL của bạn dùng overview
        [Column("overview")]
        public string Overview { get; set; }
    }
}