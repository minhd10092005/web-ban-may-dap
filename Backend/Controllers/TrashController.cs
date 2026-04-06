using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TrashController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAdminService _adminService;
    private readonly IQuoteService _quoteService;

    public TrashController(IUserService userService, IAdminService adminService, IQuoteService quoteService)
    {
        _userService = userService;
        _adminService = adminService;
        _quoteService = quoteService;
    }

    [HttpPost("restore-user/{id}")]
    public async Task<IActionResult> RestoreUser(int id) => Ok(await _userService.RestoreAsync(id));

    [HttpPost("restore-admin/{id}")]
    public async Task<IActionResult> RestoreAdmin(int id) => Ok(await _adminService.RestoreAsync(id));

    [HttpPost("restore-quote/{id}")]
    public async Task<IActionResult> RestoreQuote(int id) => Ok(await _quoteService.RestoreAsync(id));
    [HttpPost("restore-candidateProfile/{id}")]
     public async Task<IActionResult> RestoreCandidate(int id) => Ok(await _quoteService.RestoreAsync(id));

}