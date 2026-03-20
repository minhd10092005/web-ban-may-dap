// DTOs/QuoteDTO.cs
namespace Backend.DTOs
{
    public class QuoteDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Comments { get; set; }
        public int Rating { get; set; }
        public string Status { get; set; }
    }
}