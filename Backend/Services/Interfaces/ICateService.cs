using Backend.DTOs.Category;

namespace Backend.Services.Interfaces
{


    public interface ICateService
    {
        Task<List<CateDto>> GetAllAsync();
        Task<CateDto?> GetByIdAsync(int id);
        Task<CateDto> CreateAsync(CateCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }

}