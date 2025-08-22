import { Card, Group, Text, Progress } from "@mantine/core";
import "../styles/statCard.css";

export default function StatCard({ icon, label, value, color, progress }) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="stat-card">
      <Group align="center" mb="sm" className="stat-card-header">
        {icon}
        <Text fw={600} size="sm">{label}</Text>
      </Group>
      <Text fw={700} size="xl" mb="xs">{value}</Text>
      {progress !== undefined && <Progress value={progress} color={color} size="sm" radius="xl" />}
    </Card>
  );
}