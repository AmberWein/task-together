import { useState } from "react";
import { AppShell, SimpleGrid, Card, Stack, Divider, Text } from "@mantine/core";
import { Home, LayoutDashboard, User, Clock, CheckCircle, Users } from "lucide-react";

import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import ActivityItem from "../../components/ActivityItem";
import WelcomeSection from "../../components/WelcomeSection";

import "./HomePage.css";

export default function HomePage() {
  const [active, setActive] = useState("home");

  const [username, setUsername] = useState("Alex");
  const [stats, setStats] = useState({ pending: 12, completed: 34, groups: 3 });
  const [recentActivity, setRecentActivity] = useState([
    { user: "Alice", action: "completed 'Design Homepage'", time: "2h ago", status: "done" },
    { user: "Bob", action: "added a new task 'Fix bugs'", time: "5h ago", status: "in progress" },
    { user: "Charlie", action: "joined 'Family Group'", time: "1d ago" },
    { user: "Alice", action: "updated task 'Shopping List'", time: "2d ago", status: "in progress" },
  ]);

  return (
    <AppShell
      padding="md"
      header={<Header />}
    >
      <Stack gap="xl" align="center" style={{ width: "100%" }}>
        <WelcomeSection username={username} />

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" className="quick-stats">
          <StatCard icon={<Clock size={24} />} label="Pending Tasks" value={stats.pending} color="yellow" progress={stats.pending * 5} />
          <StatCard icon={<CheckCircle size={24} />} label="Completed Tasks" value={stats.completed} color="green" progress={stats.completed * 2} />
          <StatCard icon={<Users size={24} />} label="Active Groups" value={stats.groups} color="blue" />
        </SimpleGrid>

        <Divider my="sm" />

        <Card shadow="sm" p="md" radius="md" withBorder className="activity-feed">
          <Text component="h2">Recent Activity</Text>
          <Stack spacing="sm">
            {recentActivity.map((item, index) => (
              <ActivityItem
                key={index}
                user={item.user}
                action={item.action}
                time={item.time}
                status={item.status}
              />
            ))}
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}