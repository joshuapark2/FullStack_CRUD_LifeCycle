import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

const TaskTrackerApp = () => {
	return (
		<div>
			<h1>Task Tracker (Legacy)</h1>
			<TaskForm />
			<TaskList />
		</div>
	);
};

export default TaskTrackerApp;
