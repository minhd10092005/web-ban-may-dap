namespace Backend.DTOs.ProductDetail
{
    public class PrdDetailCreateDto
    {
        public int ProductId{ get; set; }
     
        public int? CateId { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}