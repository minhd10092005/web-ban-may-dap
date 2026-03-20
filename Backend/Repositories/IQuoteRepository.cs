// Repositories/IQuoteRepository.cs
using Backend.Models;

namespace Backend.Repositories
{
    public interface IQuoteRepository
    {
        Task<List<Quote>> GetAllAsync();
        Task<Quote> AddAsync(Quote quote);
    }
}