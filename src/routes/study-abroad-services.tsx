import { createFileRoute, redirect } from "@tanstack/react-router";

// Old site page: study-abroad services overview. Land on the services section.
export const Route = createFileRoute("/study-abroad-services")({
  beforeLoad: () => {
    throw redirect({
      to: "/",
      hash: "services",
      statusCode: 301,
      replace: true,
    });
  },
});
