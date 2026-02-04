package vista;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import clienteSocket.clienteSocket;
import modelo.Users;

public class PerfilFrame extends JFrame {
    
    private Users usuario;
    private clienteSocket socket;

    private JTextField txtNombre, txtApellidos, txtEmail, txtDni, txtDireccion, txtTelefono;
    private JLabel lblFoto;

    // Constructor corregido: recibe el socket y el usuario
    public PerfilFrame(clienteSocket socketRecibido, Users usuarioRecibido) {
        this.socket = socketRecibido;
        this.usuario = usuarioRecibido;
        initComponents();
        rellenarDatos(); // Llena los campos con la info del usuario
    }

    public void initComponents() {
        setTitle("Profila Kontsultatu");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(700, 500);
        setLocationRelativeTo(null);

        Color azulPrincipal = new Color(0, 128, 255);
        
        JPanel panelPrincipal = new JPanel(new BorderLayout());
        panelPrincipal.setBackground(Color.WHITE);
        setContentPane(panelPrincipal);

        // --- TITULO ---
        JLabel lblTitulo = new JLabel("ERABILTZAILEAREN PROFILA", SwingConstants.CENTER);
        lblTitulo.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblTitulo.setForeground(azulPrincipal);
        lblTitulo.setBorder(new EmptyBorder(20, 0, 20, 0));
        panelPrincipal.add(lblTitulo, BorderLayout.NORTH);

        // --- CONTENIDO CENTRAL ---
        JPanel panelCentral = new JPanel(new GridBagLayout());
        panelCentral.setBackground(Color.WHITE);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Foto (Izquierda)
        lblFoto = new JLabel("Argazkia", SwingConstants.CENTER);
        lblFoto.setPreferredSize(new Dimension(150, 180));
        lblFoto.setBorder(new LineBorder(azulPrincipal, 2));
        gbc.gridx = 0; gbc.gridy = 0;
        gbc.gridheight = 5;
        panelCentral.add(lblFoto, gbc);

        // Campos (Derecha)
        gbc.gridheight = 1;
        gbc.gridx = 1; 
        
        txtNombre = crearTextField();
        addCampo(panelCentral, gbc, 0, "Izena:", txtNombre);
        
        txtApellidos = crearTextField();
        addCampo(panelCentral, gbc, 1, "Abizenak:", txtApellidos);
        
        txtEmail = crearTextField();
        addCampo(panelCentral, gbc, 2, "Emaila:", txtEmail);
        
        txtDni = crearTextField();
        addCampo(panelCentral, gbc, 3, "DNI:", txtDni);
        
        txtTelefono = crearTextField();
        addCampo(panelCentral, gbc, 4, "Telefonoa:", txtTelefono);

        panelPrincipal.add(panelCentral, BorderLayout.CENTER);

        // --- BOTÓN VOLVER ---
        JPanel panelBoton = new JPanel();
        panelBoton.setBackground(Color.WHITE);
        JButton btnVolver = new JButton("Bueltatu");
        btnVolver.setBackground(azulPrincipal);
        btnVolver.setForeground(Color.WHITE);
        btnVolver.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btnVolver.setPreferredSize(new Dimension(120, 40));
        
        btnVolver.addActionListener(e -> {
            // Devolvemos el control al Menú pasando el socket vivo
            new MenuaFrame(socket, usuario).setVisible(true);
            dispose();
        });
        
        panelBoton.add(btnVolver);
        panelPrincipal.add(panelBoton, BorderLayout.SOUTH);
    }

    private void addCampo(JPanel panel, GridBagConstraints gbc, int y, String label, JTextField field) {
        gbc.gridy = y;
        gbc.gridx = 1;
        panel.add(new JLabel(label), gbc);
        gbc.gridx = 2;
        panel.add(field, gbc);
    }

    private JTextField crearTextField() {
        JTextField tf = new JTextField(20);
        tf.setEditable(false); // Solo lectura
        tf.setBackground(new Color(245, 245, 245));
        return tf;
    }

    private void rellenarDatos() {
        if (usuario != null) {
            txtNombre.setText(usuario.getNombre());
            txtApellidos.setText(usuario.getApellidos());
            txtEmail.setText(usuario.getEmail());
            txtDni.setText(usuario.getDni());
            txtTelefono.setText(usuario.getTelefono1());
            // Aquí podrías cargar la foto si el objeto Users tiene la ruta
        }
    }
}