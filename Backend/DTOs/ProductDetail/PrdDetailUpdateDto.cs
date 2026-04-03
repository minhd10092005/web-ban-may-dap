
namespace Backend.DTOs.ProductDetail
{
    public class PrdDetailUpdateDto
    {
    
        public int ProductId { get; set; } 
        public int CateId { get; set; }

        public string? Description { get; set; }
    }
}