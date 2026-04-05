namespace Backend.DTOs
{
    public class ReviewCvDto
    {
        public int UserId { get; set; }
        public bool IsAccepted { get; set; } // true = Duyệt, false = Từ chối
        public string? InterviewTime { get; set; }
    }
}