using Backend.DTOs.Quote;
using System.Threading.Tasks;

namespace Backend.Services.Interfaces.Ngan
{
    public interface IQuoteService_cuangan
    {
        // CHỈ GIỮ DUY NHẤT DÒNG NÀY, XÓA HẾT CÁC DÒNG GETALL, GETBYID, DELETE ĐI
        Task<QuoteDto> CreateQuoteAsync(QuoteCreateDto quoteCreateDto);

        Task<IEnumerable<QuoteDto>> GetAllQuotesAsync();
    }
}