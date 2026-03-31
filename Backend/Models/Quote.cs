using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Quote
    {
        [Key]
        [Column("quote_id")] // 🔥 FIX CHÍNH Ở ĐÂY
        public int QuoteId { get; set; }

        [Column("full_name")]
        public string? FullName { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("product_id")]
        public int? ProductId { get; set; }

        [Column("comments")]
        public string? Comments { get; set; }

        [Column("rating")]
        public int? Rating { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }
    }
}