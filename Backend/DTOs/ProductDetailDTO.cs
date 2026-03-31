using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.DTOs
{
    public class ProductDetailDTO
    {
        // Thêm dấu ? vào để C# không cằn nhằn lỗi Nullable nữa
        public string? Name { get; set; }

        public string? ModelNumber { get; set; }

       


        public string? ImageUrl { get; set; }

        [Column("overview")]
        public string? Overview { get; set; }

        public List<string>? Gallery { get; set; }

        public List<ProductSpecDTO>? Specs { get; set; }
    }
}