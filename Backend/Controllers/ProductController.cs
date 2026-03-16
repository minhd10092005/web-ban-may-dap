using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _repo;

        public ProductController(IProductRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] string search = "", [FromQuery] int? categoryId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 6)
        {
            // Truyền tham số từ URL xuống Repository
            var data = await _repo.GetProductsAdvanced(search, categoryId, page, pageSize);
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var data = await _repo.GetProductById(id);
            return Ok(data);
        }
    }
}