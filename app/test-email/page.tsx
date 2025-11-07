"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TestEmailPage() {
  const [email, setEmail] = useState("test@example.com");
  const [type, setType] = useState("2fa");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: "Network error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Email Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address:
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Type:
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2fa">2FA Code</SelectItem>
                <SelectItem value="reset">Reset Password</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={sendTestEmail}
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Test Email"}
          </Button>

          {result && (
            <Card
              className={`mt-4 ${
                result.success ? "border-green-500" : "border-red-500"
              }`}
            >
              <CardContent className="pt-6">
                <div
                  className={`text-sm ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  <strong>Status:</strong>{" "}
                  {result.success ? "Success" : "Error"}
                </div>

                <div className="mt-2">
                  <strong>Message:</strong> {result.message}
                </div>

                {result.messageId && (
                  <div className="mt-4 p-4 bg-green-50 rounded">
                    <strong>✅ Email Sent Successfully!</strong>
                    <div className="mt-2 text-sm text-gray-600">
                      Message ID: <code>{result.messageId}</code>
                    </div>
                    <div className="mt-2 text-sm text-blue-600">
                      📧 Check your email inbox to view the email
                    </div>
                  </div>
                )}

                {result.error && (
                  <div className="mt-2 text-red-600">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}

                <div className="mt-2 text-gray-600 text-xs">
                  {result.instructions}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
