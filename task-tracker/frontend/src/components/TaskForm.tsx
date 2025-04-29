import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/taskSlice";
import type { Task } from "../types/Task";

const TaskForm: React.FC = () => {
	const dispatch = useDispatch();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("Pending");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newTask = { title, description, status };

		try {
			const response = await fetch("http://localhost:8080/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTask),
			});

			if (!response.ok) throw new Error("Failed to create task");

			const savedTask: Task = await response.json();
			dispatch(addTask(savedTask));

			// Clear form
			setTitle("");
			setDescription("");
			setStatus("Pending");
		} catch (error) {
			console.error("Error creating task:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Create New Task</h2>
			<input
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
			/>
			<br />
			<textarea
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				required
			/>
			<br />
			<select value={status} onChange={(e) => setStatus(e.target.value)}>
				<option>Pending</option>
				<option>In Progress</option>
				<option>Done</option>
			</select>
			<br />
			<button type="submit">Add Task</button>
		</form>
	);
};

export default TaskForm;
