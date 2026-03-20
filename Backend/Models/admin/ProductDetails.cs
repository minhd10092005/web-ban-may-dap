public class ProductDetail
{
    [Key]
    public int ProductId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    public string Description { get; set; } = string.Empty;

    public ProductDetail(int productId, int categoryId, string description)
    {
        this.ProductId = productId;
        this.CategoryId = categoryId;
        this.Description = description;
    }

    protected ProductDetail() { }
}