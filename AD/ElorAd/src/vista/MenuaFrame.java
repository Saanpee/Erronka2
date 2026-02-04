package vista;

import java.awt.Color;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.util.List;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;

import DTO.AlumnoDTO;
import clienteSocket.clienteSocket;
import modelo.Users;

public class MenuaFrame extends JFrame {
    
    private clienteSocket socket;
    private Users usuario;
    private JPanel contentPane;

    public MenuaFrame(clienteSocket socketRecibido, Users userLogueado) {
        this.socket = socketRecibido;
        this.usuario = userLogueado;
        initComponents();
    }

    public void initComponents() {
        setTitle("Panel del Profesor - Erronka2");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setBounds(100, 100, 450, 500); 
        setLocationRelativeTo(null);
        
        contentPane = new JPanel();
        contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
        setContentPane(contentPane);
        contentPane.setLayout(null);

        // --- PANEL SUPERIOR (CABECERA) ---
        JPanel panelCabecera = new JPanel();
        panelCabecera.setBackground(new Color(245, 245, 245));
        panelCabecera.setBounds(0, 0, 434, 70);
        contentPane.add(panelCabecera);
        panelCabecera.setLayout(null);

        JLabel lblLogo = new JLabel("");
        lblLogo.setBounds(10, 10, 60, 50);
        panelCabecera.add(lblLogo);

        try {
            ImageIcon icon = new ImageIcon(getClass().getResource("/logo-elorrieta.jpg"));
            Image img = icon.getImage().getScaledInstance(lblLogo.getWidth(), lblLogo.getHeight(), Image.SCALE_SMOOTH);
            lblLogo.setIcon(new ImageIcon(img));
        } catch (Exception e) {
            System.out.println("No se pudo cargar el logo: " + e.getMessage());
        }

        JLabel lblTitulo = new JLabel("MENÚ PROFESOR");
        lblTitulo.setFont(new Font("Tahoma", Font.BOLD, 18));
        lblTitulo.setHorizontalAlignment(SwingConstants.CENTER);
        lblTitulo.setBounds(110, 20, 214, 30);
        panelCabecera.add(lblTitulo);

        // --- BOTONES DE OPCIONES ---

        // 1. Perfil
        JButton btnPerfil = new JButton("Profila kontsultatu");
        btnPerfil.setBounds(110, 100, 214, 35);
        btnPerfil.addActionListener(e -> {
            new PerfilFrame(socket, usuario).setVisible(true);
            dispose();
        });
        contentPane.add(btnPerfil);

        // 2. Alumnos (Ikasleak)
        JButton btnAlumnos = new JButton("Ikasleak kontsultatu");
        btnAlumnos.setBounds(110, 150, 214, 35);
        btnAlumnos.addActionListener(e -> {
            // Usamos el socket persistente para pedir la lista inicial
            List<AlumnoDTO> ikasles = socket.obtenerAlumnosPorProfesor(usuario.getId());
            IkasleakKontsultatu ikasleakKontsultatu = new IkasleakKontsultatu(socket, usuario, ikasles);
            ikasleakKontsultatu.setVisible(true);
            dispose();
        });
        contentPane.add(btnAlumnos);

        // 3. Horario (Ordutegia)
        JButton btnHorario = new JButton("Ordutegia kontsultatu");
        btnHorario.setBounds(110, 200, 214, 35);
        btnHorario.addActionListener(e -> {
            OrdutegiaFrame ordutegiaFrame = new OrdutegiaFrame(socket, usuario);
            ordutegiaFrame.setVisible(true);
            // Si OrdutegiaFrame necesitara el socket, deberías pasárselo también:
            // new OrdutegiaFrame(socket, usuario).setVisible(true);
            dispose();
        });
        contentPane.add(btnHorario);

        // 4. Otros Horarios
        JButton btnOtrosHorarios = new JButton("Beste ordutegi batzuk kontsultatu");
        btnOtrosHorarios.addActionListener(new ActionListener() {
        	public void actionPerformed(ActionEvent e) {
        		ConsultaOtroHorarioFrame frame = new ConsultaOtroHorarioFrame(socket, usuario);
                frame.setVisible(true);
                dispose();
        	}
        });
        btnOtrosHorarios.setBounds(110, 250, 214, 35);
        contentPane.add(btnOtrosHorarios);

        // 5. Reuniones (Batzarrak)
        JButton btnReuniones = new JButton("Batzarrak kudeatu");
        btnReuniones.setBounds(110, 300, 214, 35);
        contentPane.add(btnReuniones);

        // --- BOTÓN SALIR ---
        JButton btnSalir = new JButton("Irten");
        btnSalir.setForeground(Color.WHITE);
        btnSalir.setBackground(new Color(220, 20, 60)); // Carmesí
        btnSalir.setFont(new Font("Tahoma", Font.BOLD, 11));
        btnSalir.setBounds(110, 380, 214, 35);
        btnSalir.addActionListener(e -> {
            new LoginFrame().setVisible(true);
            dispose();
        });
        contentPane.add(btnSalir);
    }
}