package com.tasktracker.service

import com.tasktracker.model.Task
import org.springframework.stereotype.Service

@Service
class TaskService {

    private val tasks = mutableListOf(
        Task(1, "Sample Task 1", "This is the first task", "Pending"),
        Task(2, "Sample Task 2", "This is the second task", "Done")
    )

    fun getAllTasks(): List<Task> = tasks

    fun addTask(task: Task): Task {
        val newTask = task.copy(id = (tasks.maxOfOrNull { it.id } ?: 0) + 1)
        tasks.add(newTask)
        return newTask
    }
}
