package com.tasktracker.model

data class Client(
    val id: Long,
    val fullName: String,
    val clientType: String,
    val servicesRequested: List<String>,
    val servicesProposed: List<String>? = null,
    val selectedTier: String? = null,
    val status: String,
    val date: String,
    val sendPreview: Boolean = false
)
