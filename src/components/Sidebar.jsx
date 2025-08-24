import { useNavigate } from "react-router-dom";
import { Box, NavLink, Stack, Title } from "@mantine/core";

export default function Sidebar({ active }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", path: "/dashboard" },
    { label: "Board", path: "/board" },
    { label: "Profile", path: "/profile-managent" }, // keep same as your route
  ];

  return (
    <Box w={180} bg="#f5f5f5" p={24} h="100%">
      <Title order={3} mb="lg">
        TASKS
      </Title>
      <Stack gap="xs">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            active={active === item.label}
            onClick={() => navigate(item.path)}
            variant={active === item.label ? "filled" : "light"}
            color="gray"
            style={{ cursor: "pointer" }}
          />
        ))}
      </Stack>
    </Box>
  );
}