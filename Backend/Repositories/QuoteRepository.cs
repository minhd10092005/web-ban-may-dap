// Repositories/QuoteRepository.cs
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class QuoteRepository : IQuoteRepository
    {
        private readonly AppDbContext _context;

        public QuoteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Quote>> GetAllAsync()
        {
            return await _context.Quotes
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        public async Task<Quote> AddAsync(Quote quote)
        {
            quote.CreatedAt = DateTime.Now;

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return quote;
        }
    }
}