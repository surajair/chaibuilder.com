"use server";

export async function updateProjectSettings(formData: FormData) {
  const websiteId = formData.get("websiteId") as string;
  const projectName = formData.get("projectName") as string;
  const additionalLanguages = formData.getAll("additionalLanguages") as string[];

  console.log("[v0] Updating project settings:", { websiteId, projectName, additionalLanguages });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}

export async function deleteProject(formData: FormData) {
  const websiteId = formData.get("websiteId") as string;

  console.log("[v0] Deleting project:", websiteId);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}

export async function updateApiKey(formData: FormData) {
  const websiteId = formData.get("websiteId") as string;
  const action = formData.get("action") as string;

  console.log("[v0] API Key action:", { websiteId, action });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (action === "revoke") {
    return { success: true, newApiKey: `sk_${Math.random().toString(36).substring(2, 15)}` };
  }

  return { success: true };
}

export async function updateDomainSettings(formData: FormData) {
  const websiteId = formData.get("websiteId") as string;
  const customDomain = formData.get("customDomain") as string;

  console.log("[v0] Updating domain settings:", { websiteId, customDomain });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}

export async function deleteDomain(formData: FormData) {
  const websiteId = formData.get("websiteId") as string;
  const domain = formData.get("domain") as string;

  console.log("[v0] Deleting domain:", { websiteId, domain });

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}

export async function addCustomDomain(formData: FormData) {
  const websiteId = formData.get("websiteId") as string;
  const domain = formData.get("customDomain") as string;

  console.log("[v0] Adding custom domain:", { websiteId, domain });

  // Simulate Vercel domains API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { success: true, domain };
}

export async function exportSubmissionsCSV(websiteId: string) {
  console.log("[v0] Exporting submissions CSV for project:", websiteId);

  // Simulate API call to fetch submissions
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock submissions data
  const submissions = [
    {
      id: 1,
      form: "Contact Form",
      email: "john@example.com",
      date: "2024-01-15",
      status: "new",
      name: "John Doe",
      message: "Hello, I'm interested in your services.",
      phone: "+1234567890",
    },
    {
      id: 2,
      form: "Newsletter",
      email: "jane@example.com",
      date: "2024-01-14",
      status: "read",
      preferences: "Weekly updates",
    },
    {
      id: 3,
      form: "Contact Form",
      email: "bob@example.com",
      date: "2024-01-13",
      status: "new",
      name: "Bob Smith",
      message: "Can you help with my website?",
      phone: "+0987654321",
    },
  ];

  // Convert to CSV format
  const headers = ["ID", "Form", "Email", "Date", "Status", "Name", "Message", "Phone", "Preferences"];
  const csvRows = [
    headers.join(","),
    ...submissions.map((sub) =>
      [
        sub.id,
        `"${sub.form}"`,
        sub.email,
        sub.date,
        sub.status,
        `"${(sub as any).name || ""}"`,
        `"${(sub as any).message || ""}"`,
        (sub as any).phone || "",
        `"${(sub as any).preferences || ""}"`,
      ].join(","),
    ),
  ];

  return csvRows.join("\n");
}
