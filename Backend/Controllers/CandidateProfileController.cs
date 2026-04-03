using Backend.DTOs.CandidateProfile;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/candidate-profiles")]
    [ApiController]
    public class CandidateProfileController : ControllerBase
    {
        private readonly ICandidateProfileService _candidateProfileService;

        public CandidateProfileController(ICandidateProfileService candidateProfileService)
        {
            _candidateProfileService = candidateProfileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? searchTerm = null)
        {
            var result = await _candidateProfileService.GetAllAsync(pageNumber, pageSize, searchTerm);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _candidateProfileService.GetByIdAsync(id);
            if (result == null) return NotFound("Candidate Profile not found.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CandidateProfileCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var result = await _candidateProfileService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CandidateProfileUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _candidateProfileService.UpdateAsync(id, dto);
            if (!updated) return NotFound("Candidate Profile not found.");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _candidateProfileService.DeleteAsync(id);
            if (!deleted) return NotFound("Candidate Profile not found.");
            return NoContent();
        }
    }
}
