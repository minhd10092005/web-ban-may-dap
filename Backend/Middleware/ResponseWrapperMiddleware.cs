namespace Backend.Middleware
{
    public class ResponseWrapperMiddleware
    {
        private readonly RequestDelegate _next;

        public ResponseWrapperMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var originalBody = context.Response.Body;

            using var newBody = new MemoryStream();
            context.Response.Body = newBody;

            await _next(context);

            newBody.Seek(0, SeekOrigin.Begin);
            var bodyText = await new StreamReader(newBody).ReadToEndAsync();

            context.Response.Body = originalBody;

            var wrapped = new
            {
                success = true,
                data = bodyText
            };

            await context.Response.WriteAsJsonAsync(wrapped);
        }
    }
}