package modelo;


public enum TiposEnum {

    GOD(1, "god", "jainkoa"),
    ADMINISTRADOR(2, "administrador", "administratzailea"),
    PROFESOR(3, "profesor", "irakaslea"),
    ALUMNO(4, "alumno", "ikaslea");

    private final int id;
    private final String name;
    private final String nameEu;

    TiposEnum(int id, String name, String nameEu) {
        this.id = id;
        this.name = name;
        this.nameEu = nameEu;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getNameEu() {
        return nameEu;
    }

    public static TiposEnum fromId(int id) {
        for (TiposEnum t : values()) {
            if (t.id == id) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo no válido: " + id);
    }
    public static TiposEnum fromCodigo(Integer id) {
        if (id == null) {
            return null;
        }

        for (TiposEnum t : values()) {
            if (t.id == id) {
                return t;
            }
        }

        throw new IllegalArgumentException(
            "No existe TiposEnum para el código: " + id
        );
    }
}
