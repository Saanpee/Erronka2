using System;

namespace MauiApp7.Services
{
    public class AuthService
    {
        private readonly string _user = "admin";
        private readonly string _password = "1234";

        public bool Login(string username, string password)
        {
            return username == _user && password == _password;
        }
    }
}
