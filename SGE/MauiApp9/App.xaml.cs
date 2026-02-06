namespace MauiApp9
{
    /// <summary>
    /// Clase principal de la aplicación que hereda de Application.
    /// Define la página principal que se mostrará al iniciar la app.
    /// </summary>
    public partial class App : Application
    {
        /// <summary>
        /// Constructor de la aplicación.
        /// Inicializa los componentes y establece MainPage como la página principal.
        /// </summary>
        public App()
        {
            // Inicializar componentes definidos en App.xaml
            InitializeComponent();

            // Establecer MainPage como la página principal de la aplicación
            // MainPage contiene el BlazorWebView que renderiza los componentes Razor
            MainPage = new MainPage();
        }
    }
}
