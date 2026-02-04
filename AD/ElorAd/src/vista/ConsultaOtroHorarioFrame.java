package vista;

import java.awt.*;
import java.util.List;
import javax.swing.*;
import clienteSocket.clienteSocket;
import modelo.Users;

public class ConsultaOtroHorarioFrame extends JFrame {
    private clienteSocket socket;
    private Users usuarioLogueado;
    private JTextField txtBusqueda;
    private DefaultListModel<Users> modeloLista;
    private JList<Users> listaProfesores;

    public ConsultaOtroHorarioFrame(clienteSocket socket, Users usuario) {
        this.socket = socket;
        this.usuarioLogueado = usuario;
        
        setTitle("Buscador de Horarios de Profesores");
        setSize(400, 500);
        setLocationRelativeTo(null);
        initComponents();
    }

    private void initComponents() {
        JPanel panelPrincipal = new JPanel(new BorderLayout(10, 10));
        panelPrincipal.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Arriba: Buscador
        JPanel panelNorte = new JPanel(new BorderLayout(5, 5));
        txtBusqueda = new JTextField();
        JButton btnBuscar = new JButton("Bilatu");
        panelNorte.add(new JLabel("Irakaslearen izena:"), BorderLayout.NORTH);
        panelNorte.add(txtBusqueda, BorderLayout.CENTER);
        panelNorte.add(btnBuscar, BorderLayout.EAST);

        // Centro: Lista de resultados
        modeloLista = new DefaultListModel<>();
        listaProfesores = new JList<>(modeloLista);
        // Renderizador para que se vea el nombre y apellido en la lista
        listaProfesores.setCellRenderer((list, value, index, isSelected, cellHasFocus) -> 
            new JLabel(value.getNombre() + " " + value.getApellidos()));

        panelPrincipal.add(panelNorte, BorderLayout.NORTH);
        panelPrincipal.add(new JScrollPane(listaProfesores), BorderLayout.CENTER);

        // Abajo: Botones
        JButton btnVerHorario = new JButton("Ikusi Ordutegia");
        btnVerHorario.setBackground(new Color(0, 128, 255));
        btnVerHorario.setForeground(Color.WHITE);
        
        btnVerHorario.addActionListener(e -> {
            Users profeSeleccionado = listaProfesores.getSelectedValue();
            if (profeSeleccionado != null) {
                // REUTILIZAMOS tu OrdutegiaFrame pasándole el profe seleccionado
                new OrdutegiaFrame(socket, profeSeleccionado).setVisible(true);
                dispose();
            }
        });

        panelPrincipal.add(btnVerHorario, BorderLayout.SOUTH);
        btnBuscar.addActionListener(e -> realizarBusqueda());
        
        setContentPane(panelPrincipal);
    }

    private void realizarBusqueda() {
        List<Users> resultados = socket.buscarProfesores(txtBusqueda.getText());
        modeloLista.clear();
        for (Users u : resultados) modeloLista.addElement(u);
    }
}