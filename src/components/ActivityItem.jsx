import { Stack, Text, Badge, Paper } from "@mantine/core";
import "../styles/activityItem.css";

export default function ActivityItem({ user, action, time, status }) {
  return (
    <Paper
      shadow="xs"
      radius="md"
      padding="sm"
      className="activity-item-centered"
    >
      <Stack spacing={2} align="center">
        <Text size="sm" weight={500} align="center">
          <b>{user}</b> {action}
        </Text>
        <Text size="xs" color="dimmed" align="center">
          {time}
        </Text>
        {status && (
          <Badge color={status === "done" ? "green" : "blue"} variant="light">
            {status}
          </Badge>
        )}
      </Stack>
    </Paper>
  );
}
