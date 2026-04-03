namespace Backend.DTOs.ProductImage
{
    public class ProductImageDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}