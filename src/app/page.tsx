import { redirect } from "next/navigation";

// Root path redirects to the (app) group home page
export default function RootPage() {
  redirect("/dashboard");
}
