namespace Backend.Middleware{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LoggingMiddleware> _logger;

        public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var request = context.Request;
            _logger.LogInformation(($"[REQUEST]{request.Method}{request.Path}"));
            await _next(context);

            _logger.LogInformation($"[RESPONSE]{context.Response.StatusCode}");

        }
    }
}