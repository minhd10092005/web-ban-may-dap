using Backend.DTOs.Quote;
using Backend.Services.Interfaces.Ngan;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

// LƯU Ý: Namespace phải viết đúng thế này để App.MapControllers() tìm thấy
namespace Backend.Controllers.Ngan
{
    [ApiController]
    [Route("api/NganQuotes")] // Hoặc [Route("api/NganQuotes")]
    public class NganQuotesController : ControllerBase
    {
        private readonly IQuoteService_cuangan _quoteService;

        public NganQuotesController(IQuoteService_cuangan quoteService)
        {
            _quoteService = quoteService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitQuote([FromBody] QuoteCreateDto quoteCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _quoteService.CreateQuoteAsync(quoteCreateDto);
                return Ok(new
                {
                    Message = "Cảm ơn bạn! Phản hồi đã được ghi nhận.",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi hệ thống: " + ex.Message);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetQuotes()
        {
            // Lấy toàn bộ danh sách, lọc những cái có dữ liệu và trả về
            var quotes = await _quoteService.GetAllQuotesAsync(); // Bạn cần thêm hàm này vào Service
            return Ok(quotes);
        }
    }
}