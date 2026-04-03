using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.ProductImage
{
    public class ProductImageCreateDto
    {
        [Required(ErrorMessage = "ProductId là bắt buộc")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "ImageUrl là bắt buộc")]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
    }
}