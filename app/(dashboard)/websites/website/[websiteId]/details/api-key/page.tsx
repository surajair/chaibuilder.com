"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, RotateCcw } from "lucide-react";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useActionState, useState } from "react";
import { updateApiKey } from "../actions";

export default function ApiKeySettingsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const [apiKey, setApiKey] = useState(`sk_${websiteId}_1234567890abcdef...`);
  const [copied, setCopied] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await updateApiKey(formData);
      if (result.success && result.newApiKey) {
        setApiKey(result.newApiKey);
      }
      return result;
    },
    { success: false },
  );

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">API Key</h1>
        <p className="text-muted-foreground mt-2">Manage your project&lsquo;s API key for external integrations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project API Key</CardTitle>
          <CardDescription>Use this key to authenticate API requests to your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input value={apiKey} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopyKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Keep your API key secure and never share it publicly.</p>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyKey}>
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Key"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Revoke & Generate New
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately revoke your current API key and generate a new one. Any applications using the
                    current key will stop working until updated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Form action={formAction}>
                    <input type="hidden" name="websiteId" value={websiteId} />
                    <input type="hidden" name="action" value="revoke" />
                    <AlertDialogAction
                      type="submit"
                      disabled={pending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {pending ? "Revoking..." : "Revoke & Generate New"}
                    </AlertDialogAction>
                  </Form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
