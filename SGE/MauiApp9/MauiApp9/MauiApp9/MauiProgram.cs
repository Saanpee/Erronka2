using MauiApp9.Services;
using Microsoft.Extensions.Logging;

namespace MauiApp9
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts => fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular"));

            builder.Services.AddMauiBlazorWebView();

            builder.Services.AddScoped(sp => new HttpClient
            {
                BaseAddress = new Uri("http://10.5.104.147:8080/")
            });

            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<CentroService>();

#if DEBUG
            builder.Services.AddBlazorWebViewDeveloperTools();
            builder.Logging.AddDebug();
#endif
            return builder.Build();
        }
    }
}