using Backend.DTOs.CandidateProfile;
using Backend.DTOs.Common;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ICandidateProfileService
    {
        Task<PagedResult<CandidateProfileDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<CandidateProfileDto?> GetByIdAsync(int id);
        Task<CandidateProfileDto> CreateAsync(CandidateProfileCreateDto dto);
        Task<bool> UpdateAsync(int id, CandidateProfileUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<CandidateProfile>> GetTrashAsync();
        Task<bool> RestoreAsync(int id);
    }
}
