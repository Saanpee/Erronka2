using System.Text.Json.Serialization;

namespace MauiApp9.Models
{
  
    public class RootObject
    {
        
        [JsonPropertyName("CENTROS")]
        public List<Centro> Centros { get; set; } = new();
    }

    
    public class Centro
    {
        
        [JsonPropertyName("CCEN")]
        public int Codigo { get; set; }

       
        [JsonPropertyName("NOM")]
        public string Nombre { get; set; }

        
        [JsonPropertyName("DTITUC")]
        public string TipoCentro { get; set; }

        
        [JsonPropertyName("DTERRE")]
        public string Territorio { get; set; }

        
        [JsonPropertyName("DMUNIC")]
        public string Municipio { get; set; }

       
        [JsonPropertyName("DOMI")]
        public string Direccion { get; set; }

       
        [JsonPropertyName("TEL1")]
        public int Telefono { get; set; }

        
        [JsonPropertyName("EMAIL")]
        public string Email { get; set; }

        
        [JsonPropertyName("PAGINA")]
        public string Web { get; set; }

        
        [JsonPropertyName("LONGITUD")]
        public double Latitud { get; set; } 

        
        [JsonPropertyName("LATITUD")]
        public double Longitud { get; set; }

    }
}