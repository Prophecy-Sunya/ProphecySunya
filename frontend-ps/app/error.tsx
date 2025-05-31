"use client";

import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold flex items-center text-warning">
        <ExclamationTriangleIcon className="size-8 mr-2 " />
        Oops! Something went wrong!
      </h1>
      <p className="text-lg">{error.message}</p>

      <Button onPress={reset} variant="shadow">
        <ArrowPathIcon className="size-6 mr-2" />
        Try again
      </Button>
    </main>
  );
}
