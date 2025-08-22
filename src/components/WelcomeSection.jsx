import { Text } from "@mantine/core";
// import "../styles/components.css";

export default function WelcomeSection({ username }) {
  return (
    <div className="welcome-section">
        <h1>Welcome back, {username}</h1>
        <Text c="dimmed" mt="xs">Here’s a quick look at your progress and team activity today.</Text>
    </div>
  );
}