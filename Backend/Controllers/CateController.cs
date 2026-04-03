using Microsoft.AspNetCore.Mvc;
using Backend.Services.Implementations;
using Backend.Services.Interfaces;
using Backend.DTOs.Category;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CateController : ControllerBase
    {
        private readonly ICateService _service;

        public CateController(ICateService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);

            if (data == null)
                return NotFound();

            return Ok(data);

        }

        [HttpPost]
        public async Task<IActionResult> Create(CateCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.CateId }, created);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }


        


    }

}
