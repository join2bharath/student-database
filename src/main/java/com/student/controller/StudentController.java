package com.student.controller;

import com.student.model.Student;
import com.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> addStudent(@RequestBody Student student) {
        boolean isSaved = studentRepository.save(student);
        Map<String, String> response = new HashMap<>();
        if (isSaved) {
            response.put("message", "Student data inserted successfully!");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to insert student data. Student ID might already exist.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
