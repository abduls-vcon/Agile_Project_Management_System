import { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Navbar from "../Components/Layout/Navbar";
import Sidebar from "../Components/Layout/Sidebar";
import InfoBar from "../Components/Layout/InfoBar";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useApp } from "../Context";
import type { Role, UserStoryStatus, Priority } from "../Models";
import ChartCard from "../Components/Analytics/ChartCard";
import { BounceLoader } from "react-spinners";

const AnalyticsDashboard: React.FC = () => {
  const { users, projects } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const userRoleData = useMemo(() => {
    const roles: Role[] = ["Developer", "Manager", "Tester"];
    return roles.map((role, id) => ({
      id,
      label: role,
      value: users.filter((u) => u.role === role).length,
    }));
  }, [users]);

  const userStoryStatusData = useMemo(() => {
    const allStories = projects.flatMap((p) => p.userStories);
    const statusCounts = allStories.reduce(
      (acc, story) => {
        acc[story.status] = (acc[story.status] || 0) + 1;
        return acc;
      },
      {} as Record<UserStoryStatus, number>,
    );

    const statuses: UserStoryStatus[] = [
      "Backlog",
      "In Progress",
      "Testing",
      "Completed",
    ];

    return statuses.map((status, id) => ({
      id,
      label: status,
      value: statusCounts[status] || 0,
    }));
  }, [projects]);

  const userStoriesPerProjectData = useMemo(() => {
    const data = projects.map((p) => ({
      name: p.name,
      count: p.userStories.length,
    }));
    return {
      xAxis: [{ data: data.map((d) => d.name), label: "Projects" }],
      series: [{ data: data.map((d) => d.count), label: "User Stories", color: "#6366F1"}],
    };
  }, [projects]);

  const userStoryPriorityData = useMemo(() => {
    const allStories = projects.flatMap((p) => p.userStories);
    const priorityCounts = allStories.reduce(
      (acc, story) => {
        acc[story.priority] = (acc[story.priority] || 0) + 1;
        return acc;
      },
      {} as Record<Priority, number>,
    );

    const priorities: Priority[] = ["High", "Medium", "Low"];

    return priorities.map((priority, id) => ({
      id,
      label: priority,
      value: priorityCounts[priority] || 0,
    }));
  }, [projects]);

  const projectStatusData = useMemo(() => {
    const statusCounts = projects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const statuses = ["Active", "On Hold", "Complete"];
    return {
      xAxis: [
        {
          data: statuses,
          label: "Project Status",
          colorMap: {
            type: "ordinal" as const,
            colors: ["#10B981", "#F59E0B", "#665FC9"],
          },
        },
      ],
      yAxis: [{ label: "Project Count" }],
      series: [
        {
          data: statuses.map((s) => statusCounts[s] || 0),
        },
      ],
    };
  }, [projects]);

  const pieChartBoxSx = {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const barChartTitleSx = {
    textAlign: "center",
    mb: 2,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#dee4ff",
      }}
    >
      <Navbar />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            p: 3,
          }}
        >
          <InfoBar />
          {loading ? (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(248,250,252,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <BounceLoader color="#6366F1" size={80} />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                <ChartCard title="User Role Distribution" boxSx={pieChartBoxSx}>
                  <PieChart
                    colors={["#665FC9", "#F6C445", "#7A7A7A"]}
                    series={[{ data: userRoleData }]}
                    width={200}
                    height={200}
                  />
                </ChartCard>
                <ChartCard title="UserStories Status" boxSx={pieChartBoxSx}>
                  <PieChart
                    series={[{ data: userStoryStatusData }]}
                    width={200}
                    height={200}
                  />
                </ChartCard>
                <ChartCard title="User Story Priority" boxSx={pieChartBoxSx}>
                  <PieChart
                    colors={["#EF4444", "#F59E0B", "#10B981"]}
                    series={[{ data: userStoryPriorityData }]}
                    width={200}
                    height={200}
                  />
                </ChartCard>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <ChartCard
                  title="User Stories Per Project"
                  titleSx={barChartTitleSx}
                >
                  <BarChart
                    xAxis={userStoriesPerProjectData.xAxis}
                    yAxis={[{ label: "User Stories" }]}
                    series={userStoriesPerProjectData.series}
                    height={300}
                    width={550}
                  />
                </ChartCard>
                <ChartCard
                  title="Project Status Distribution"
                  titleSx={barChartTitleSx}
                >
                  <BarChart
                    xAxis={projectStatusData.xAxis}
                    yAxis={projectStatusData.yAxis}
                    series={projectStatusData.series}
                    height={300}
                    width={500}
                  />
                </ChartCard>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
