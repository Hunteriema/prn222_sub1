import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
          <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
            <div className="h-48 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

