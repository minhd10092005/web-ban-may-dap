using Backend.DTOs.CandidateProfile;
using Backend.DTOs.Common;

namespace Backend.Services.Interfaces
{
    public interface ICandidateProfileService
    {
        Task<PagedResult<CandidateProfileDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task<CandidateProfileDto?> GetByIdAsync(int id);
        Task<CandidateProfileDto> CreateAsync(CandidateProfileCreateDto dto);
        Task<bool> UpdateAsync(int id, CandidateProfileUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
