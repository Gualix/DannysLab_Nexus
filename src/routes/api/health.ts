import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Simple health check - can be extended with database checks, etc.
          const health = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
          };

          return new Response(JSON.stringify(health), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("[Health Check] Error:", error);
          return new Response(
            JSON.stringify({
              status: "unhealthy",
              error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
