import { createFileRoute, redirect } from "@tanstack/react-router";

// Old site blog post. Land on the blog section of the homepage.
export const Route = createFileRoute("/post-2")({
  beforeLoad: () => {
    throw redirect({
      to: "/",
      hash: "blog",
      statusCode: 301,
      replace: true,
    });
  },
});
