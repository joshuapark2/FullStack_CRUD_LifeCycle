import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import type { Task } from "../types/Task";
import { setTasks } from "../redux/taskSlice";

const TaskList: React.FC = () => {
	const dispatch = useDispatch();
	const tasks = useSelector((state: RootState) => state.tasks);

	// State for editing
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
	const [editForm, setEditForm] = useState<{
		title: string;
		description: string;
		status: string;
	}>({
		title: "",
		description: "",
		status: "Pending",
	});

	// Start editing a task
	const startEditing = (task: Task) => {
		setEditingTaskId(task.id);
		setEditForm({
			title: task.title,
			description: task.description,
			status: task.status,
		});
	};

	// Handle form input changes
	const handleFormChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setEditForm((prev) => ({ ...prev, [name]: value }));
	};

	// Submit updated task
	const submitUpdate = async (task: Task) => {
		try {
			const updatedTask = { ...task, ...editForm };
			const response = await fetch(`http://localhost:8080/tasks/${task.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedTask),
			});
			if (!response.ok) throw new Error("Failed to update task");

			const returnedTask: Task = await response.json();
			const updatedTasks = tasks.map((t) =>
				t.id === task.id ? returnedTask : t,
			);

			dispatch(setTasks(updatedTasks));
			setEditingTaskId(null); // Exit edit mode
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};

	// Fetch tasks on mount
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch("http://localhost:8080/tasks");
				if (!response.ok) throw new Error("Failed to fetch tasks");
				const data: Task[] = await response.json();
				dispatch(setTasks(data));
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};

		fetchTasks();
	}, [dispatch]);

	// Delete a task
	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(`http://localhost:8080/tasks/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete task");

			const updatedTasks = tasks.filter((task) => task.id !== id);
			dispatch(setTasks(updatedTasks));
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

	return (
		<div>
			<h2>Your Tasks</h2>
			{tasks.length === 0 ? (
				<p>No tasks found.</p>
			) : (
				<ul>
					{tasks.map((task: Task) => (
						<li key={task.id}>
							{editingTaskId === task.id ? (
								<div>
									<input
										type="text"
										name="title"
										value={editForm.title}
										onChange={handleFormChange}
									/>
									<br />
									<textarea
										name="description"
										value={editForm.description}
										onChange={handleFormChange}
									/>
									<br />
									<select
										name="status"
										value={editForm.status}
										onChange={handleFormChange}
									>
										<option>Pending</option>
										<option>In Progress</option>
										<option>Done</option>
									</select>
									<br />
									<button type="button" onClick={() => submitUpdate(task)}>
										Save
									</button>
									<button type="button" onClick={() => setEditingTaskId(null)}>
										Cancel
									</button>
								</div>
							) : (
								<div>
									<strong>{task.title}</strong> - {task.status}
									<br />
									<small>{task.description}</small>
									<br />
									<button type="button" onClick={() => startEditing(task)}>
										Edit
									</button>
									<button type="button" onClick={() => handleDelete(task.id)}>
										Delete
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TaskList;
