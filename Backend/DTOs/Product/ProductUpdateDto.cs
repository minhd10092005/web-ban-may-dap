using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Product
{
    public class ProductUpdateDto
    {
        [Required]
        public string ProductName{get; set; }
        public int? CateId { get; set; }
    }
}