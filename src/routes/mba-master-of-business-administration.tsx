import { createFileRoute, redirect } from "@tanstack/react-router";

// Old site page: MBA course detail. Land on the destinations/courses section.
export const Route = createFileRoute("/mba-master-of-business-administration")({
  beforeLoad: () => {
    throw redirect({
      to: "/",
      hash: "destinations",
      statusCode: 301,
      replace: true,
    });
  },
});
