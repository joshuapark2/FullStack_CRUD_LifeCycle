import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import type { Task } from "../types/Task";
import { setTasks } from "../redux/taskSlice";

const TaskList: React.FC = () => {
	const dispatch = useDispatch();
	const tasks = useSelector((state: RootState) => state.tasks);

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

	return (
		<div>
			<h2>Your Tasks</h2>
			{tasks.length === 0 ? (
				<p>No tasks found.</p>
			) : (
				<ul>
					{tasks.map((task: Task) => (
						<li key={task.id}>
							<strong>{task.title}</strong> - {task.status}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TaskList;
