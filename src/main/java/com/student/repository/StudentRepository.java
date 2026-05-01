package com.student.repository;

import com.student.model.Student;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StudentRepository {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @PostConstruct
    public void init() {
        try (Connection conn = DriverManager.getConnection(url, username, password);
             Statement stmt = conn.createStatement()) {
            
            stmt.execute("CREATE DATABASE IF NOT EXISTS student_db");
            stmt.execute("USE student_db");

            String createTableSql = "CREATE TABLE IF NOT EXISTS student (" +
                    "student_id VARCHAR(50) PRIMARY KEY, " +
                    "roll_number VARCHAR(50), " +
                    "phone_number VARCHAR(20), " +
                    "date_of_birth VARCHAR(20), " +
                    "address VARCHAR(255))";
            stmt.execute(createTableSql);
            System.out.println("Student table verified/created.");

        } catch (Exception e) {
            System.err.println("Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public boolean save(Student student) {
        String insertSql = "INSERT INTO student (student_id, roll_number, phone_number, date_of_birth, address) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
             
            conn.setCatalog("student_db");
            
            pstmt.setString(1, student.getStudentId());
            pstmt.setString(2, student.getRollNumber());
            pstmt.setString(3, student.getPhoneNumber());
            pstmt.setString(4, student.getDateOfBirth());
            pstmt.setString(5, student.getAddress());
            
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
            
        } catch (Exception e) {
            System.err.println("Error saving student: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public List<Student> findAll() {
        List<Student> students = new ArrayList<>();
        String selectSql = "SELECT * FROM student";
        
        try (Connection conn = DriverManager.getConnection(url, username, password);
             Statement stmt = conn.createStatement()) {
             
            conn.setCatalog("student_db");
            ResultSet rs = stmt.executeQuery(selectSql);
            
            while (rs.next()) {
                Student s = new Student();
                s.setStudentId(rs.getString("student_id"));
                s.setRollNumber(rs.getString("roll_number"));
                s.setPhoneNumber(rs.getString("phone_number"));
                s.setDateOfBirth(rs.getString("date_of_birth"));
                s.setAddress(rs.getString("address"));
                students.add(s);
            }
            
        } catch (Exception e) {
            System.err.println("Error finding students: " + e.getMessage());
            e.printStackTrace();
        }
        return students;
    }
}
