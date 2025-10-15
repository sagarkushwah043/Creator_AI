"use client";

import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn appearance={{ elements: { formButtonPrimary: "bg-blue-600 hover:bg-blue-700" } }} />
    </div>
  );
}
