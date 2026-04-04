namespace Backend.DTOs.Product
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductType { get; set; }
        public int? CateId { get; set; }
        public string CateName { get; set; }
        public string? ImageUrl { get; set; } // Dùng cho trang danh sách

        // PHẢI CÓ 2 DÒNG NÀY THÌ TRANG CHI TIẾT MỚI CHẠY ĐƯỢC
        public string? Description { get; set; }
        public List<ProductImageDto>? ProductImages { get; set; }
    }

    public class ProductImageDto
    {
        public string ImageUrl { get; set; }
    }
}