package edu.DTO;

import java.io.Serializable;
import java.sql.Timestamp;

public class AlumnoDTO implements Serializable {

    public Integer id;
    public String email;
    public String username;
    public String nombre;
    public String apellidos;
    private String dni;
    private String direccion;
    private String telefono1;
    private String telefono2;
    private String argazkiaUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String tipo; // nombre del tipo (ALUMNO, etc.)
	
    
    public AlumnoDTO() {}
    
    
 
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getApellidos() {
		return apellidos;
	}
	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}
	public String getDni() {
		return dni;
	}
	public void setDni(String dni) {
		this.dni = dni;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public String getTelefono1() {
		return telefono1;
	}
	public void setTelefono1(String telefono1) {
		this.telefono1 = telefono1;
	}
	public String getTelefono2() {
		return telefono2;
	}
	public void setTelefono2(String telefono2) {
		this.telefono2 = telefono2;
	}
	public String getArgazkiaUrl() {
		return argazkiaUrl;
	}
	public void setArgazkiaUrl(String argazkiaUrl) {
		this.argazkiaUrl = argazkiaUrl;
	}
	public Timestamp getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}
	public Timestamp getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	@Override
	public String toString() {
		return "AlumnoDTO [id=" + id + ", email=" + email + ", username=" + username + ", nombre=" + nombre
				+ ", apellidos=" + apellidos + ", dni=" + dni + ", direccion=" + direccion + ", telefono1=" + telefono1
				+ ", telefono2=" + telefono2 + ", argazkiaUrl=" + argazkiaUrl + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + ", tipo=" + tipo + "]";
	}

    
    // getters y setters
}
