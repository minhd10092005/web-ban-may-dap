// Controllers/QuoteController.cs
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuoteController : ControllerBase
    {
        private readonly IQuoteRepository _repo;

        public QuoteController(IQuoteRepository repo)
        {
            _repo = repo;
        }

        // GET
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _repo.GetAllAsync();
            return Ok(data);
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> Create(QuoteDTO dto)
        {
            var quote = new Quote
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Comments = dto.Comments,
                Rating = dto.Rating,
                Status = dto.Status,
                CreatedAt = DateTime.Now
            };

            var result = await _repo.AddAsync(quote);
            return Ok(result);
        }
    }
}