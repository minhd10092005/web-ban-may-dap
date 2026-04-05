using Backend.DTOs.Quote;
using Backend.DTOs.Common;

namespace Backend.Services.Interfaces
{
    public interface IQuoteService
    {
        Task<PagedResult<QuoteDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<QuoteDto?> GetByIdAsync(int id);
        Task<QuoteDto> CreateAsync(QuoteCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
