using Backend.DTOs.User;
using Backend.DTOs.Common;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<PagedResult<UserDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(UserCreateDto dto);
        Task<bool> UpdateAsync(int id, UserUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<User>> GetTrashAsync();
        Task<bool> RestoreAsync(int id);
    }
}
