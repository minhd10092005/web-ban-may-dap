using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface ICandidateRepository
    {
        Task<CandidateProfile?> GetProfileByUserIdAsync(int userId);
        Task UpdateOrCreateProfileAsync(CandidateProfile profile);
    }
}