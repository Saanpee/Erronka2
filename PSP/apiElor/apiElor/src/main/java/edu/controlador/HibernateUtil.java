package edu.controlador;

import java.util.logging.Level;

import java.util.logging.Logger;

import org.hibernate.SessionFactory;

import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

import org.hibernate.cfg.Configuration;









public class HibernateUtil {

private static final SessionFactory sessionFactory =

buildSessionFactory();

private static SessionFactory buildSessionFactory() {

try {

Logger logger = Logger.getLogger("org.hibernate");

logger.setLevel(Level.OFF);

return new Configuration().configure()

.buildSessionFactory(new

StandardServiceRegistryBuilder().configure().build());

} catch (Throwable ex) {

System.err.println("Initial SessionFactory creation failed." + ex);

throw new ExceptionInInitializerError(ex);

}

}

public static SessionFactory getSessionFactory() {

return sessionFactory;

}

}

