public class Category
{
    [Key]
    public int CateId { get; set; }

    [Required]
    [MaxLength(50)]
    public string CateName { get; set; } = string.Empty;

    public Category(int cateId, string cateName)
    {
        this.CateId = cateId;
        this.CateName = cateName;
    }

    protected Category() { }
}