using Backend.DTOs.CandidateProfile;
using Backend.Data;
using Backend.DTOs.Common;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class CandidateProfileService : ICandidateProfileService
    {
        private readonly AppDbContext _context;

        public CandidateProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<CandidateProfileDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
        {
            var query = _context.CandidateProfiles
                .Include(c => c.User)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(c => c.FullName.Contains(searchTerm) || c.Phone.Contains(searchTerm) || c.User.Email.Contains(searchTerm));
            }

            var projected = query
                .OrderByDescending(c => c.Id)
                .Select(c => new CandidateProfileDto
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Address = c.Address,
                    ResumeUrl = c.ResumeUrl,
                    Email = c.User.Email,
                    CreatedAt = c.CreatedAt
                });

            return await projected.ToPagedListAsync(pageNumber, pageSize);
        }

        public async Task<CandidateProfileDto?> GetByIdAsync(int id)
        {
            return await _context.CandidateProfiles
                .Include(c => c.User)
                .Where(c => c.Id == id)
                .Select(c => new CandidateProfileDto
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Address = c.Address,
                    ResumeUrl = c.ResumeUrl,
                    Email = c.User.Email,
                    CreatedAt = c.CreatedAt
                }).FirstOrDefaultAsync();
        }

        public async Task<CandidateProfileDto> CreateAsync(CandidateProfileCreateDto dto)
        {
            // Verify User exists
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
                throw new Exception("User not found!");

            var profile = new Models.CandidateProfile(
                0, // ID is auto-increment
                dto.UserId,
                null!, // Navigation property
                dto.FullName,
                dto.Phone,
                dto.Address,
                dto.ResumeUrl
            );

            _context.CandidateProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(profile.Id) ?? throw new Exception("Error retrieving saved profile");
        }

        public async Task<bool> UpdateAsync(int id, CandidateProfileUpdateDto dto)
        {
            var profile = await _context.CandidateProfiles.FindAsync(id);
            if (profile == null) return false;

            profile.FullName = dto.FullName;
            profile.Phone = dto.Phone;
            profile.Address = dto.Address;
            profile.ResumeUrl = dto.ResumeUrl;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var profile = await _context.CandidateProfiles.FindAsync(id);
            if (profile == null) return false;

            profile.IsDeleted = true; // Soft Delete
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
