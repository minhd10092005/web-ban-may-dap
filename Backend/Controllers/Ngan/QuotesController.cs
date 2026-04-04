using Backend.DTOs.Quote;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

// LƯU Ý: Namespace phải viết đúng thế này để App.MapControllers() tìm thấy
namespace Backend.Controllers
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
    }
}