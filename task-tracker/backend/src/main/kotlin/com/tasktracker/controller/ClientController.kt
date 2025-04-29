package com.tasktracker.controller

import com.tasktracker.model.Client
import com.tasktracker.service.ClientService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/clients")
class ClientController(val service: ClientService) {

    @GetMapping
    fun getClients(): List<Client> = service.getAllClients()

    @GetMapping("/{id}")
    fun getClient(@PathVariable id: Long): Client? = service.getClientById(id)

    @PostMapping
    fun createClient(@RequestBody client: Client): Client = service.addClient(client)

    @PutMapping("/{id}")
    fun updateClient(@PathVariable id: Long, @RequestBody client: Client): Client? =
        service.updateClient(id, client)

    @DeleteMapping("/{id}")
    fun deleteClient(@PathVariable id: Long): String {
        return if (service.deleteClient(id)) "Client deleted." else "Client not found."
    }

    // ✨ ADD THIS to delete ALL clients
    @DeleteMapping
    fun deleteAllClients(): ResponseEntity<Void> {
        service.deleteAllClients()
        return ResponseEntity.noContent().build()
    }
}
