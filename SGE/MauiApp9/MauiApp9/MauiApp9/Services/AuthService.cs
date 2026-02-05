using System.Net.Http.Json;
using MauiApp9.Models;

namespace MauiApp9.Services
{
    public class AuthService
    {
        private readonly HttpClient _httpClient;

        public AuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> Login(string username, string password)
        {
            try
            {
                string url = $"Users/login/{username}/{password}";

                var response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {                   
                    var respuesta = await response.Content.ReadFromJsonAsync<LoginRespuestaDto>();

                    if (respuesta != null && !string.IsNullOrEmpty(respuesta.Username))
                    {
                        await SecureStorage.SetAsync("user_actual", username);
                        return true;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Konexio errorea zerbitzariarekin: {ex.Message}");
                return false;
            }
        }       
    }
}