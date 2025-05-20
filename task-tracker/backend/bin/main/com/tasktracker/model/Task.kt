package com.tasktracker.model

data class Task(
    val id: Long,
    val title: String,
    val description: String,
    val status: String
)
