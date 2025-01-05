"use client";
// CURRENTLY NOT DOING ANYTHING WITH THIS FILE
import { UserProvider } from "./UserContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
