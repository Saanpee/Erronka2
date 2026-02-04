 
package vista;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

import clienteSocket.clienteSocket;
import modelo.Users;

public class LoginFrame extends JFrame {

    // Se inicializa una sola vez al cargar la clase
    private clienteSocket clientesocket = new clienteSocket();

    private JPanel contentPane;
    private JTextField txtErabiltzaile;
    private JPasswordField txtPasahitza;
    private String erabiltzailea;
    private String pasahitza;

    public LoginFrame() {
        setTitle("Login - ElorES");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        
        // Fondo azul de la ventana principal
        getContentPane().setBackground(new Color(0, 128, 255));
        getContentPane().setLayout(new GridBagLayout());

        // Panel blanco central
        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.setPreferredSize(new Dimension(300, 220));
        panel.setBorder(new EmptyBorder(15, 15, 15, 15));
        panel.setLayout(null);

        // Logo Elorrieta
        JLabel lblLogo = new JLabel();
        lblLogo.setBounds(10, 6, 64, 49);
        try {
            ImageIcon originalIcon = new ImageIcon(getClass().getResource("/logo-elorrieta.jpg"));
            Image img = originalIcon.getImage().getScaledInstance(64, 49, Image.SCALE_SMOOTH);
            lblLogo.setIcon(new ImageIcon(img));
        } catch (Exception e) {
            System.out.println("Logo no encontrado");
        }
        panel.add(lblLogo);

        // Título de la aplicación
        JLabel loginLabel = new JLabel("ElorES");
        loginLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        loginLabel.setForeground(new Color(0, 128, 255));
        loginLabel.setHorizontalAlignment(SwingConstants.CENTER);
        loginLabel.setBounds(89, 6, 108, 30);
        panel.add(loginLabel);

        // Etiqueta Usuario
        JLabel lblErabiltzaile = new JLabel("Erabiltzaile");
        lblErabiltzaile.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblErabiltzaile.setBounds(30, 60, 100, 15);
        panel.add(lblErabiltzaile);

        // Campo de texto Usuario
        txtErabiltzaile = new JTextField();
        txtErabiltzaile.setBounds(30, 78, 240, 25);
        panel.add(txtErabiltzaile);

        // Etiqueta Pasahitza
        JLabel lblPasahitza = new JLabel("Pasahitza");
        lblPasahitza.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblPasahitza.setBounds(30, 110, 100, 15);
        panel.add(lblPasahitza);

        // Campo de texto Password
        txtPasahitza = new JPasswordField();
        txtPasahitza.setBounds(30, 128, 240, 25);
        panel.add(txtPasahitza);

        // Botón Login
        JButton btnLogin = new JButton("HASIERATU");
        btnLogin.setBounds(89, 170, 121, 30);
        btnLogin.setBackground(new Color(0, 128, 255));
        btnLogin.setForeground(Color.BLACK);
        btnLogin.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btnLogin.setFocusPainted(false);
        
        btnLogin.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                erabiltzailea = txtErabiltzaile.getText();
                pasahitza = new String(txtPasahitza.getPassword());

                // Llamada al socket (ahora devuelve el usuario o null)
                Users usuario = clientesocket.loginIkerketa(erabiltzailea, pasahitza);

                if (usuario != null) {
                    // PASO DE TESTIGO: Pasamos el socket y el usuario al menú
                    MenuaFrame menuaFrame = new MenuaFrame(clientesocket, usuario);
                    menuaFrame.setVisible(true);
                    dispose(); // Cerramos el login
                } else {
                    // Si falla, limpiamos la contraseña
                    txtPasahitza.setText("");
                    txtErabiltzaile.requestFocus();
                }
            }
        });
        panel.add(btnLogin);

        // Añadir el panel central al frame
        getContentPane().add(panel);
    }

    public static void main(String[] args) {
        EventQueue.invokeLater(new Runnable() {
            public void run() {
                try {
                    LoginFrame frame = new LoginFrame();
                    frame.setVisible(true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}