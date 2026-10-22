import { createFileRoute, redirect } from "@tanstack/react-router";

// Old site page: SAT test info. Land on the services section.
export const Route = createFileRoute("/sat-scholastic-assessment-test")({
  beforeLoad: () => {
    throw redirect({
      to: "/",
      hash: "services",
      statusCode: 301,
      replace: true,
    });
  },
});
