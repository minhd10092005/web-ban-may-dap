using Backend.DTOs.Admin;
using Backend.DTOs.Common;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IAdminService
    {
        Task<PagedResult<AdminDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<AdminDto?> GetByIdAsync(int id);
        Task<AdminDto> CreateAsync(AdminCreateDto dto);
        Task<bool> UpdateAsync(int id, AdminUpdateDto dto);
        Task<bool> DeleteAsync(int id);


        Task<AdminLoginResponseDto?> AuthenticateAsync(AdminLoginDto dto);
        Task<IEnumerable<Admin>> GetTrashAsync();
        Task<bool> RestoreAsync(int id);
    }
}
