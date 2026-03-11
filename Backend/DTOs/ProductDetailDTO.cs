namespace Backend.DTOs
{
    public class ProductDetailDTO
    {
        public string Name { get; set; }

        public string ModelNumber { get; set; }

        public List<ProductSpecDTO> Specs { get; set; }
    }
}