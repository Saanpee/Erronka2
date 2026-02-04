package edu.servidorSocket;

import java.io.*;
import java.net.*;

public class ServidorSocket {
    private static final int PUERTO = 12345;  // Puerto en el que escuchará el servidor

    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PUERTO)) {
            System.out.println("Servidor escuchando en puerto " + PUERTO);
            
            while (true) {
                Socket clienteSocket = serverSocket.accept();
                System.out.println("Cliente conectado: " + clienteSocket.getInetAddress());
                
                clienteHandler handler = new clienteHandler(clienteSocket);
                Thread hilo = new Thread(handler);
                hilo.start(); // Inicia el hilo
                
                // Maneja la conexión con el cliente (esto puede ser en otro hilo)
                
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}