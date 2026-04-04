using Backend.DTOs.Quote;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class QuoteService : IQuoteService
    {
        private readonly AppDbContext _context;

        public QuoteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<QuoteDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
        {
            var query = _context.Quotes.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(q => q.FullName.Contains(searchTerm) || q.EmailAddress.Contains(searchTerm) || q.CompanyName.Contains(searchTerm));
            }

            var projected = query
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new QuoteDto
                {
                    Id = q.Id,
                    FullName = q.FullName,
                    CompanyName = q.CompanyName,
                    EmailAddress = q.EmailAddress,
                    Phone = q.Phone,
                    Address = q.Address,
                    City = q.City,
                    State = q.State,
                    PostalCode = q.PostalCode,
                    Country = q.Country,
                    Comments = q.Comments,
                    CreatedAt = q.CreatedAt
                });

            return await projected.ToPagedListAsync(pageNumber, pageSize);
        }

        public async Task<QuoteDto?> GetByIdAsync(int id)
        {
            return await _context.Quotes
                .Where(q => q.Id == id)
                .Select(q => new QuoteDto
                {
                    Id = q.Id,
                    FullName = q.FullName,
                    CompanyName = q.CompanyName,
                    EmailAddress = q.EmailAddress,
                    Phone = q.Phone,
                    Address = q.Address,
                    City = q.City,
                    State = q.State,
                    PostalCode = q.PostalCode,
                    Country = q.Country,
                    Comments = q.Comments,
                    CreatedAt = q.CreatedAt
                }).FirstOrDefaultAsync();
        }

        public async Task<QuoteDto> CreateAsync(QuoteCreateDto dto)
        {
            var quote = new Models.Quote(
                dto.FullName, dto.CompanyName, dto.Address, dto.City, dto.State,
                dto.PostalCode, dto.Country, dto.EmailAddress, dto.Phone, dto.Comments
            );

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return new QuoteDto
            {
                Id = quote.Id,
                FullName = quote.FullName,
                CompanyName = quote.CompanyName,
                EmailAddress = quote.EmailAddress,
                Phone = quote.Phone,
                Address = quote.Address,
                City = quote.City,
                State = quote.State,
                PostalCode = quote.PostalCode,
                Country = quote.Country,
                Comments = quote.Comments,
                CreatedAt = quote.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null) return false;

            quote.IsDeleted = true; // Soft Delete
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
