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
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Download, FileText, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const exportSubmissionsCSV = (websiteId: string) => {};

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
  {
    id: 6,
    form: "Contact Form",
    email: "david@example.com",
    date: "2024-01-10",
    status: "read",
    data: { name: "David Wilson", message: "Great service!", phone: "+1122334455" },
  },
];

export default function SubmissionsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  // Filter submissions based on search term
  const filteredSubmissions = mockSubmissions.filter(
    (submission) =>
      submission.form.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = await exportSubmissionsCSV(websiteId);
      const blob = new Blob([csvData as any], { type: "text/csv" });
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
          <h1 className="text-3xl font-playfair font-bold text-foreground">Form Submissions</h1>
          <p className="text-muted-foreground mt-2">View and manage form submissions from your website.</p>
        </div>
        <Button onClick={handleExportCSV} disabled={isExporting} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {filteredSubmissions.length}</span>
          <span>New: {filteredSubmissions.filter((s) => s.status === "new").length}</span>
          <span>Read: {filteredSubmissions.filter((s) => s.status === "read").length}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            {searchTerm
              ? `Showing ${filteredSubmissions.length} results for "${searchTerm}"`
              : "All form submissions from your website visitors"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{submission.form}</p>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={submission.status === "new" ? "default" : "secondary"}>{submission.status}</Badge>
                  <span className="text-sm text-muted-foreground min-w-[80px]">{submission.date}</span>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View Details
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
                                <span className="text-muted-foreground max-w-md text-right">{value}</span>
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

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No submissions found matching your search." : "No submissions yet."}
              </p>
            </div>
          )}

          {filteredSubmissions.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSubmissions.length)} of{" "}
                {filteredSubmissions.length} submissions
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
