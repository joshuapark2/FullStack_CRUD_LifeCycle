package com.tasktracker.controller

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.PathVariable
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

  @PutMapping("/{id}")
  fun updateTask(@PathVariable id: Long, @RequestBody task: Task): Task? {
    return service.updateTask(id, task)
  }

  @DeleteMapping("/{id}")
  fun deleteTask(@PathVariable id: Long): String {
    return if (service.deleteTask(id)) {
      "Task with id $id deleted successfully."
    } else {
      "Task with id $id not found."
    }
  }
}
