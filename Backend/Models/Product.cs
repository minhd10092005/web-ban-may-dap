<<<<<<< HEAD
﻿using System.ComponentModel.DataAnnotations;
=======
using System.ComponentModel.DataAnnotations;
>>>>>>> 63e53f2d11e14889da4629cc6978c27bb7be35a8
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
<<<<<<< HEAD
        public int ProductId { get; set; }

        [Column("product_name")]
        public string ProductName { get; set; }

        [Column("image_url")]
        public string ImageUrl { get; set; }
        public string? Overview { get; internal set; }
=======
        public int Id { get; set; }

        [Column("product_name")]
        public string Name { get; set; }

        // THÊM DẤU ? VÀO STRING
        [Column("image_url")]
        public string? ImageUrl { get; set; }

        // THÊM DẤU ? VÀO STRING
        [Column("overview")]
        public string? Overview { get; set; }
>>>>>>> 63e53f2d11e14889da4629cc6978c27bb7be35a8
    }
}