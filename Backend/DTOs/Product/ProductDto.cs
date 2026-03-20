namespace Backend.DTOs.Product

{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int? CateId { get; set; }
        public string CateName { get; set; } = string.Empty;
    }
}