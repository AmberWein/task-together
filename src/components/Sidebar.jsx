import { useNavigate } from "react-router-dom";
import { Box, NavLink, Stack, Title } from "@mantine/core";

export default function Sidebar({ active }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", path: "/home" },
    { label: "Board", path: "/board" },
    { label: "Profile", path: "/profile-managent" }, // keep same as your route
  ];

  return (
    <Box w={400} bg="#f5f5f5" px={40} py={32} h="100%">
      <Title order={3} mb={48}>
        TASKS
      </Title>
      <Stack spacing="xl"> {/* use spacing, not gap */}
        {menuItems.map((item) => (
            <NavLink
            key={item.label}
            label={item.label}
            active={active === item.label}
            onClick={() => navigate(item.path)}
            variant={active === item.label ? "filled" : "light"}
            style={{ cursor: "pointer", fontSize: 18 }} // remove padding
            />
        ))}
      </Stack>
    </Box>
  );
}
