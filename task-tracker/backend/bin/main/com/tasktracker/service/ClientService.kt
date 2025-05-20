package com.tasktracker.service

import com.tasktracker.model.Client
import org.springframework.stereotype.Service

@Service
class ClientService {

    private val clients = mutableListOf<Client>()

    fun getAllClients(): List<Client> = clients

    fun getClientById(id: Long): Client? = clients.find { it.id == id }

    fun addClient(client: Client): Client {
        val newClient = client.copy(id = (clients.maxOfOrNull { it.id } ?: 0) + 1)
        clients.add(newClient)
        return newClient
    }

    fun updateClient(id: Long, updatedClient: Client): Client? {
        val index = clients.indexOfFirst { it.id == id }
        return if (index != -1) {
            val clientToUpdate = updatedClient.copy(id = id)
            clients[index] = clientToUpdate
            clientToUpdate
        } else {
            null
        }
    }

    fun deleteClient(id: Long): Boolean {
        return clients.removeIf { it.id == id }
    }

    // ✨ NEW: Delete all clients
    fun deleteAllClients() {
        clients.clear()
    }
}
