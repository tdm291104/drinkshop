"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export function OAuthButtons() {
  return (
    <div className="mx-20 space-y-3">
      <div className="flex items-center justify-center">
        <div className="border-t border-gray-300 flex-grow"></div>
        <span className="px-3 text-gray-500 text-sm">Hoặc đăng nhập với</span>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <div className="flex gap-8">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-none border-gray-300 hover:bg-gray-100 cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-none border-gray-300 hover:bg-gray-100 cursor-pointer"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
