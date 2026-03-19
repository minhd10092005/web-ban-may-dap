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

        // THÊM DẤU ? VÀO STRING
        [Column("image_url")]
        public string? ImageUrl { get; set; }

        // THÊM DẤU ? VÀO STRING
        [Column("overview")]
        public string? Overview { get; set; }
    }
}