using Backend.DTOs.Admin;
using Backend.DTOs.Common;

namespace Backend.Services.Interfaces
{
    public interface IAdminService
    {
        Task<PagedResult<AdminDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<AdminDto?> GetByIdAsync(int id);
        Task<AdminDto> CreateAsync(AdminCreateDto dto);
        Task<bool> UpdateAsync(int id, AdminUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
