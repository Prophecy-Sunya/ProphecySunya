"use client";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold flex items-center text-warning">
        <ExclamationTriangleIcon className="size-8 mr-2 " />
        404 Error | This page could not be found
      </h1>
      <Button variant="shadow">
        <Link href="/" className="inline-flex items-center ">
          <ArrowLeftIcon className="size-6 mr-2" />
          Go back home
        </Link>
      </Button>
    </main>
  );
}
