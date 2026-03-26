namespace Backend.Middleware
{
    public class RateLimitingMiddleware
    {
        private static Dictionary<string, (int Count, DateTime Time)> _requests = new();

        private readonly RequestDelegate _next;

        public RateLimitingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            if (_requests.ContainsKey(ip))
            {
                var (count, time) = _requests[ip];

                if ((DateTime.Now - time).Seconds < 10 && count > 10)
                {
                    context.Response.StatusCode = 429;
                    await context.Response.WriteAsync("Too many requests");
                    return;
                }

                _requests[ip] = (count + 1, time);
            }
            else
            {
                _requests[ip] = (1, DateTime.Now);
            }

            await _next(context);
        }
    }
}