using Backend.DTOs.ProductDetail;
using Backend.Services.Admin.ProductDetail;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/controller")]
    public class ProductDetailController : ControllerBase
    {
        private readonly IProductDetailService _detailService;

        public ProductDetailController(IProductDetailService detailService)
        {
            _detailService = detailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _detailService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _detailService.GetByIdAsync(id);
            if (data == null)
                return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(PrdDetailCreateDto dto)
        {
            var created = await _detailService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ProductId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(PrdDetailUpdateDto dto,int id)
        {
            var updated = await _detailService.UpdateAsync(id,dto);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _detailService.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }

}