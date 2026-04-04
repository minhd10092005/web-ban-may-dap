using Backend.DTOs.Product;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/Products")]
    [ApiController]
    public class ProductsController_cuaminh : ControllerBase
    {
        private readonly IProductService_cuaminh _productService;

        public ProductsController_cuaminh(IProductService_cuaminh productService)
        {
            _productService = productService;
        }

        // 1. LẤY DANH SÁCH SẢN PHẨM (Gộp chung: Phân trang, Tìm kiếm, Lọc)
        // GET: api/Products?search=...&cateId=...&page=1&pageSize=6
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] int? cateId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {
            // Nếu không truyền tham số phân trang, và ông vẫn muốn lấy hết (ví dụ cho mobile hoặc logic khác)
            // thì Service vẫn xử lý được, nhưng mặc định sẽ trả về theo Page.
            var (items, totalCount) = await _productService.GetPagedProductsAsync(search, cateId, page, pageSize);

            return Ok(new
            {
                items,
                totalCount,
                currentPage = page,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        // 2. LẤY CHI TIẾT SẢN PHẨM THEO ID
        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { message = $"Không tìm thấy sản phẩm với ID = {id}" });
            }

            return Ok(product);
        }

        // 3. TẠO MỚI SẢN PHẨM
        // POST: api/Products
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdProduct = await _productService.CreateProductAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.ProductId }, createdProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo sản phẩm", error = ex.Message });
            }
        }

        // 4. CẬP NHẬT THÔNG TIN SẢN PHẨM
        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var isUpdated = await _productService.UpdateProductAsync(id, dto);

            if (!isUpdated)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm để cập nhật hoặc ID không khớp." });
            }

            return NoContent();
        }

        // 5. XÓA SẢN PHẨM (Soft Delete)
        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var isDeleted = await _productService.DeleteProductAsync(id);

            if (!isDeleted)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm để xóa." });
            }

            return NoContent();
        }
    }
}