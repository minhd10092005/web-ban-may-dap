using Backend.DTOs.Quote;
using Backend.DTOs.Common;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IQuoteService
    {
        Task<PagedResult<QuoteDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<QuoteDto?> GetByIdAsync(int id);
        Task<QuoteDto> CreateAsync(QuoteCreateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Quote>> GetTrashAsync();
        Task<bool> RestoreAsync(int id);
    }
}
