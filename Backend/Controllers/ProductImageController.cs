using Backend.DTOs.ProductImage;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _service;

        public ProductImageController(IProductImageService service)
        {
            _service = service;
        }

        // GET: api/productimage?pageNumber=1&pageSize=10&searchTerm=&productId=&sortBy=id&sortDir=desc
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] int? productId = null,
            [FromQuery] string sortBy = "id",
            [FromQuery] string sortDir = "desc")
        {
            var data = await _service.GetAllAsync(pageNumber, pageSize, searchTerm, productId, sortBy, sortDir);
            return Ok(data);
        }

        // GET: api/productimage/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        // POST: api/productimage
        [HttpPost]
        public async Task<IActionResult> Create(ProductImageCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/productimage/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductImageUpdateDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        // DELETE: api/productimage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
