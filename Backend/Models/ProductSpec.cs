namespace Backend.Models
{
    public class ProductSpec
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string SpecName { get; set; }

        public string SpecValue { get; set; }

        public string Unit { get; set; }
    }
}
