"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { exportSubmissionsCSV } from "../actions";

const mockSubmissions = [
  {
    id: 1,
    form: "Contact Form",
    email: "john@example.com",
    date: "2024-01-15",
    status: "new",
    data: { name: "John Doe", message: "Hello, I'm interested in your services.", phone: "+1234567890" },
  },
  {
    id: 2,
    form: "Newsletter",
    email: "jane@example.com",
    date: "2024-01-14",
    status: "read",
    data: { email: "jane@example.com", preferences: "Weekly updates" },
  },
  {
    id: 3,
    form: "Contact Form",
    email: "bob@example.com",
    date: "2024-01-13",
    status: "new",
    data: { name: "Bob Smith", message: "Can you help with my website?", phone: "+0987654321" },
  },
  {
    id: 4,
    form: "Support Request",
    email: "alice@example.com",
    date: "2024-01-12",
    status: "read",
    data: { name: "Alice Johnson", issue: "Login problems", priority: "High" },
  },
  {
    id: 5,
    form: "Newsletter",
    email: "charlie@example.com",
    date: "2024-01-11",
    status: "new",
    data: { email: "charlie@example.com", preferences: "Monthly updates" },
  },
];

export default function SubmissionsSettingsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(mockSubmissions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubmissions = mockSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = await exportSubmissionsCSV(websiteId);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submissions-${websiteId}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Form Submissions</h1>
          <p className="text-muted-foreground mt-2">View and manage form submissions from your website.</p>
        </div>
        <Button onClick={handleExportCSV} disabled={isExporting} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest form submissions from your website visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{submission.form}</p>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={submission.status === "new" ? "default" : "secondary"}>{submission.status}</Badge>
                  <span className="text-sm text-muted-foreground">{submission.date}</span>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{submission.form} Submission</DialogTitle>
                        <DialogDescription>
                          Submitted by {submission.email} on {submission.date}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={submission.status === "new" ? "default" : "secondary"}>
                            {submission.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">ID: {submission.id}</span>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium">Submission Data:</h4>
                          <div className="bg-muted p-4 rounded-lg space-y-2">
                            {Object.entries(submission.data).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium capitalize">{key}:</span>
                                <span className="text-muted-foreground">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, mockSubmissions.length)} of{" "}
              {mockSubmissions.length} submissions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
