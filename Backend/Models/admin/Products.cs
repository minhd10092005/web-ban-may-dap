public class Product : EntityClass
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string ProductType { get; set; } = string.Empty;

  

    public Product(int Id, string ProductName, string ProductType ){
        this.Id = Id;
        this.ProductName = ProductName;
        this.ProductType = ProductType;
       
    }
    protected Product() { }




}