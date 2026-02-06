using System.Text.Json.Serialization;

namespace MauiApp9.Models
{
    public class WeatherResponse
    {
        [JsonPropertyName("current_weather")]
        public CurrentWeather Current { get; set; }

        [JsonPropertyName("daily")]
        public DailyWeather Daily { get; set; }
    }
    public class CurrentWeather
    {
        [JsonPropertyName("temperature")]
        public double Temperature { get; set; }

        [JsonPropertyName("windspeed")]
        public double WindSpeed { get; set; }
    }

    public class DailyWeather
    {
        [JsonPropertyName("time")]
        public List<string> Time { get; set; }

        [JsonPropertyName("temperature_2m_max")]
        public List<double> MaxTemp { get; set; }

        [JsonPropertyName("temperature_2m_min")]
        public List<double> MinTemp { get; set; }
    }
}