import { useEffect, useState } from "react";
import { AppShell, SimpleGrid, Card, Stack, Divider, Text } from "@mantine/core";
import { Clock, CheckCircle, Users } from "lucide-react";

import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import ActivityItem from "../../components/ActivityItem";
import WelcomeSection from "../../components/WelcomeSection";
import { supabase } from "../../supabaseClient";

import { getTaskStats, getActiveGroups, getRecentActivity } from "../../services/homeService";
import "./HomePage.css";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [stats, setStats] = useState({ pending: 0, completed: 0, groups: 0 });
  const [activities, setActivities] = useState([]);

     useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (user) {
        setUsername(user.user_metadata.full_name || user.email);
        setUserId(user.id);
      }
    }

    fetchUser();
  }, []);
  
  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      const taskStats = await getTaskStats(userId);
      const groups = await getActiveGroups(userId);
      const recentActivities = await getRecentActivity(userId);

      setStats({ ...taskStats, groups: groups.length });
      setActivities(recentActivities);
    }
    fetchData();
  }, [userId]);

 return (
    <AppShell padding="md" header={<Header />}>
      <Stack gap="xl" align="center" style={{ width: "100%" }}>
        <WelcomeSection username={username} />

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" className="quick-stats">
          <StatCard icon={<Clock size={24} />} label="Pending Tasks" value={stats.pending} color="yellow" progress={stats.pending * 5} />
          <StatCard icon={<CheckCircle size={24} />} label="Completed Tasks" value={stats.completed} color="green" progress={stats.completed * 2} />
          <StatCard icon={<Users size={24} />} label="Active Groups" value={stats.groups} color="blue" />
        </SimpleGrid>

        <Divider my="sm" />

        <Card shadow="sm" p="md" radius="md" withBorder className="activity-feed">
          <Text component="h2" size="lg" fw={600} mb="sm">Recent Activity</Text>
          <Stack spacing="sm">
            {activities.length > 0 ? (
              activities.map((item, index) => (
                <ActivityItem key={index} user={item.user} action={item.action} time={item.time} status={item.status} />
              ))
            ) : (
              <Text size="sm" c="dimmed">No recent activity yet.</Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}