using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Product
{
    public class ProductUpdateDto
    {
        [Required] public string ProductName { get; set; } = string.Empty;
        public string ProductType { get; set; } = string.Empty;
        public int? CateId { get; set; }

    }
}