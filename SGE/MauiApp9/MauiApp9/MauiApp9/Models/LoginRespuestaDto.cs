using System.Text.Json.Serialization;

namespace MauiApp9.Models
{
    public class LoginRespuestaDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; }
    }
}