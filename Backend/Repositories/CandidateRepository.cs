using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly AppDbContext _context;

        public CandidateRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CandidateProfile?> GetProfileByUserIdAsync(int userId)
        {
            return await _context.CandidateProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task UpdateOrCreateProfileAsync(CandidateProfile profile)
        {
            var existing = await _context.CandidateProfiles.FirstOrDefaultAsync(p => p.UserId == profile.UserId);
            if (existing == null)
            {
                _context.CandidateProfiles.Add(profile); // Tạo mới nếu chưa có
            }
            else
            {
                // Cập nhật nếu đã có
                existing.FullName = profile.FullName;
                existing.Phone = profile.Phone;
                existing.Address = profile.Address;
                existing.ResumeUrl = profile.ResumeUrl;
            }
            await _context.SaveChangesAsync();
        }
    }
}