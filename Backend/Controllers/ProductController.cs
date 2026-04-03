using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.Repositories.Interfaces;
using Backend.DTOs.Product;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly IProductRepository _repo;

        public ProductController(IProductService service, IProductRepository repo)
        {
            _service = service;
            _repo = repo;
        }

        // ================= USER =================

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string search = "",
            [FromQuery] int? categoryId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {
            var data = await _repo.GetProductsAdvanced(search, categoryId, page, pageSize);
            return Ok(data);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var data = await _repo.GetProductById(id);
            return Ok(data);
        }

        // ================= ADMIN =================

        // GET: api/products/admin
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllAdmin(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] int? cateId = null)
        {
            var data = await _service.GetAllAsync(pageNumber, pageSize, searchTerm, cateId);
            return Ok(data);
        }

        // POST: api/products/admin
        [HttpPost("admin")]
        public async Task<IActionResult> Create(ProductCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetProduct), new { id = created.ProductId }, created);
        }

        // PUT: api/products/admin/5
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> Update(int id, ProductUpdateDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);

            if (!updated)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/products/admin/5
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}