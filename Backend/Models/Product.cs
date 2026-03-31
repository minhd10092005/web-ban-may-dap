using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("product_name")]
        public string ProductName { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("overview")]
        public string? Overview { get; set; }

        // --------------------------------------------------------
        // LƯU Ý: 
        // Tôi đã tạm thời comment (vô hiệu hóa) hai dòng dưới đây 
        // vì bạn đã có ProductId và ProductName ở trên rồi. 
        // Nếu giữ lại, Entity Framework sẽ báo lỗi trùng cột CSDL.
        // --------------------------------------------------------

        // public int Id { get; set; }

        // [Column("product_name")]
        // public string Name { get; set; }
    }
}