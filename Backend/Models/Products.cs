using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{

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

     

        public Category? Category { get; set; } 
        public ProductDetail? ProductDetail { get; set; }

        public Product(int id, string productName, string productType ){
            this.Id = id;
            this.ProductName = productName;
            this.ProductType = productType;
        
        }
     

        public Product()
        {
           
        }
    }

}