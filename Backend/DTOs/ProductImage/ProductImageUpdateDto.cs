using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.ProductImage
{
    public class ProductImageUpdateDto
    {
        [Required(ErrorMessage = "ImageUrl là bắt buộc")]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
    }
}
