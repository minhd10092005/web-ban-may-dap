namespace Backend.DTOs.ProductDetail
{
    public class ProductDetailDto
    {
        public int? ProductId { get; set; } 
        public string ProductName {get; set; }= string.Empty;
        public int? CateId { get; set; }
        public string CateName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}