using MauiApp9.Models;
using System.Text.Json;

namespace MauiApp9.Services
{
    public class CentroService
    {
        private List<Centro> _centros = new();
        private bool _inicializado = false;

        public async Task InicializarAsync()
        {
            if (_inicializado) return;

            try
            {
                using var stream = await FileSystem.OpenAppPackageFileAsync("EuskadiLatLon.json");
                using var reader = new StreamReader(stream);
                var jsonContent = await reader.ReadToEndAsync();
                var datos = JsonSerializer.Deserialize<RootObject>(jsonContent);

                if (datos != null && datos.Centros != null)
                {
                    _centros = datos.Centros;
                    _inicializado = true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error leyendo JSON: {ex.Message}");
            }
        }


        public List<string> ObtenerTipos()
        {
            return _centros.Select(c => c.TipoCentro).Distinct().OrderBy(x => x).ToList();
        }

        public List<string> ObtenerTerritorios(string tipo)
        {
            return _centros
                .Where(c => c.TipoCentro == tipo)
                .Select(c => c.Territorio)
                .Distinct()
                .OrderBy(x => x)
                .ToList();
        }

        public List<string> ObtenerMunicipios(string tipo, string territorio)
        {
            return _centros
                .Where(c => c.TipoCentro == tipo && c.Territorio == territorio)
                .Select(c => c.Municipio)
                .Distinct()
                .OrderBy(x => x)
                .ToList();
        }
        
        public List<Centro> FiltrarCentros(string tipo, string territorio, string municipio)
        {
            return _centros
                .Where(c => c.TipoCentro == tipo &&
                            c.Territorio == territorio &&
                            c.Municipio == municipio)
                .OrderBy(c => c.Nombre)
                .ToList();
        }
        public Centro ObtenerPorId(int codigo)
        {
            return _centros.FirstOrDefault(c => c.Codigo == codigo);
        }
    }
}