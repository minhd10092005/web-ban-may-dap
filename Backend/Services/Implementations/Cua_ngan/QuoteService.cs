using Backend.Data;
using Backend.DTOs.Quote;
using Backend.Models;
using Backend.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Backend.Services.Implementations
{
    // KẾ THỪA IQuoteService_cuangan Ở ĐÂY
    public class QuoteService_cuangan : IQuoteService_cuangan
    {
        private readonly AppDbContext _context;

        public QuoteService_cuangan(AppDbContext context)
        {
            _context = context;
        }

        public async Task<QuoteDto> CreateQuoteAsync(QuoteCreateDto dto)
        {
            string combinedComments = $"[{dto.Rating}/5 SAO] - {dto.Comments}";

            var quote = new Quote(
                dto.FullName,
                dto.CompanyName,
                dto.Address,
                dto.City,
                dto.State,
                dto.PostalCode,
                dto.Country,
                dto.EmailAddress,
                dto.Phone,
                combinedComments
            );

            quote.CreatedAt = DateTime.UtcNow;

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return new QuoteDto
            {
                Id = quote.Id,
                FullName = quote.FullName,
                CompanyName = quote.CompanyName,
                Address = quote.Address,
                City = quote.City,
                State = quote.State,
                PostalCode = quote.PostalCode,
                Country = quote.Country,
                EmailAddress = quote.EmailAddress,
                Phone = quote.Phone,
                Comments = quote.Comments,
                CreatedAt = quote.CreatedAt
            };
        }
    }
}