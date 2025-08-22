import { AppShellHeader, Group, Text, Button } from "@mantine/core";
import "../styles/header.css";

export default function Header() {
  return (
    <AppShellHeader height={60} p="xs" className="app-header">
      <Group justify="space-between" align="center" style={{ height: "100%" }}>
        <Text fw={600} size="lg">Task Manager</Text>
        <Button variant="light" radius="md" size="xs">Logout</Button>
      </Group>
    </AppShellHeader>
  );
}