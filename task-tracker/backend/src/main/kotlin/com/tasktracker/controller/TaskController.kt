package com.tasktracker.controller

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import com.tasktracker.service.TaskService
import com.tasktracker.model.Task

@RestController
@RequestMapping("/tasks")
class TaskController(val service: TaskService) {

  @GetMapping
  fun getTasks(): List<Task> = service.getAllTasks()

  @PostMapping
  fun createTask(@RequestBody task: Task): Task {
      return service.addTask(task)
  }
}
