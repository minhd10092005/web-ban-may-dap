namespace Backend.DTOs.Category
{
    public class ProductDetailDto
    {
        public int? ProductId { get; set; }
        public int? CateId { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}