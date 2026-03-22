namespace Backend.DTOs.ProductDetail
{
    public class PrdDetailDto
    {
        public int? ProductId {get; set; }
        public int? CateId { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}