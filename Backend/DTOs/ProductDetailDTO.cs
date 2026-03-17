namespace Backend.DTOs
{
    public class ProductDetailDTO
    {
        public string Name { get; set; }

        public string ImageUrl { get; set; }

        public List<ProductSpecDTO> Specs { get; set; }
    }
}