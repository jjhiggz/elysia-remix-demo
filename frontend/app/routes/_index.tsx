/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import {
  redirect,
  type LinksFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader = () => {
  return redirect("/dashboard");
};
export const links: LinksFunction = () => [];
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <Outlet />;
}
