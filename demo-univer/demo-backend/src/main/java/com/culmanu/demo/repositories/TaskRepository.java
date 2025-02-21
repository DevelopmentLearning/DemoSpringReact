package com.culmanu.demo.repositories;

import com.culmanu.demo.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}