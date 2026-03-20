using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Product
{
    public class ProductCreateDto
    {
        [Required]
        public string ProductName { get; set; }
        public int? CateId { get; set; } 


    }
}