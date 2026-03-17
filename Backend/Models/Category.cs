using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("category")]
    public class Category
    {
        [Key]
        [Column("cateid")]
        public int CateId { get; set; }

        [Column("catename")]
        public string CateName { get; set; }
    }
}