"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface RevisionInfo {
  id: string;
  number: number;
  publishedBy: string;
  publishedAt: string;
  isLive?: boolean;
  isDraft?: boolean;
}

const ComparisonPage = () => {
  const searchParams = useSearchParams();
  const [version1, setVersion1] = useState<string>("");
  const [version2, setVersion2] = useState<string>("");
  const [version1Data, setVersion1Data] = useState<RevisionInfo | null>(null);
  const [version2Data, setVersion2Data] = useState<RevisionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableRevisions, setAvailableRevisions] = useState<RevisionInfo[]>(
    []
  );

  // Function to fetch available revisions
  const fetchAvailableRevisions = useCallback(async () => {
    try {
      // This is a placeholder - replace with actual API call
      const mockRevisions: RevisionInfo[] = [
        {
          id: "c8a27531-b488-4ad7-a89d-24522113a0d9",
          number: 1,
          publishedBy: "John Doe",
          publishedAt: "2023-06-15 14:30:00",
        },
        {
          id: "84b6305f-4163-4b33-9f53-459e684e9382",
          number: 2,
          publishedBy: "Jane Smith",
          publishedAt: "2023-06-16 09:45:00",
        },
        {
          id: "1cfad81f-fe22-4b57-89d3-ec3900baf825",
          number: 3,
          publishedBy: "Alex Johnson",
          publishedAt: "2023-06-17 16:20:00",
        },
        {
          id: "eab77147-e7ec-4342-8362-5cd0c870c08f",
          number: 4,
          publishedBy: "Sarah Williams",
          publishedAt: "2023-06-18 11:10:00",
        },
      ];

      // Add live version
      mockRevisions.push({
        id: "live",
        number: 0,
        publishedBy: "System",
        publishedAt: "2023-06-19 10:00:00",
        isLive: true,
      });

      // Add draft version
      mockRevisions.push({
        id: "draft",
        number: 0,
        publishedBy: "System",
        publishedAt: "2023-06-19 10:00:00",
        isDraft: true,
      });

      setAvailableRevisions(mockRevisions);
    } catch (error) {
      console.error("Error fetching revisions:", error);
    }
  }, []);

  // Function to parse version string
  const parseVersionString = useCallback(
    (versionString: string): { type: string; id: string; label?: string } => {
      if (!versionString) return { type: "", id: "" };

      if (versionString.startsWith("draft:")) {
        return { type: "draft", id: versionString.replace("draft:", "") };
      }

      if (versionString.startsWith("live:")) {
        return { type: "live", id: versionString.replace("live:", "") };
      }

      if (versionString.startsWith("revision:")) {
        const parts = versionString.replace("revision:", "").split(":");
        return {
          type: "revision",
          id: parts[0],
          label: parts.length > 1 ? parts[1] : "1",
        };
      }

      return { type: "", id: "" };
    },
    []
  );

  // Function to fetch revision data
  const fetchRevisionData = useCallback(
    async (versionString: string, versionKey: "version1" | "version2") => {
      if (!versionString) return;

      setLoading(true);

      try {
        const { type, id, label } = parseVersionString(versionString);
        let revisionData: RevisionInfo;

        if (type === "live") {
          revisionData = {
            id,
            number: 0,
            publishedBy: "System",
            publishedAt: "2023-06-19 10:00:00",
            isLive: true,
          };
        } else if (type === "draft") {
          revisionData = {
            id,
            number: 0,
            publishedBy: "System",
            publishedAt: "2023-06-19 10:00:00",
            isDraft: true,
          };
        } else if (type === "revision") {
          // Find in available revisions or fetch from API
          const found = availableRevisions.find((rev) => rev.id === id);
          if (found) {
            revisionData = {
              ...found,
              number: parseInt(label || "1"),
            };
          } else {
            // Mock data if not found
            revisionData = {
              id,
              number: parseInt(label || "1"),
              publishedBy: "Unknown User",
              publishedAt: new Date().toISOString(),
            };
          }
        } else {
          // Default case
          revisionData = {
            id: versionString,
            number: 0,
            publishedBy: "Unknown",
            publishedAt: new Date().toISOString(),
          };
        }

        if (versionKey === "version1") {
          setVersion1Data(revisionData);
        } else {
          setVersion2Data(revisionData);
        }
      } catch (error) {
        console.error(`Error fetching version ${versionString}:`, error);
      } finally {
        setLoading(false);
      }
    },
    [availableRevisions, parseVersionString]
  );

  // Generate URL for iframe based on version string
  const getVersionUrl = useCallback(
    (versionString: string): string => {
      if (!versionString) return "";

      const { type, id, label } = parseVersionString(versionString);

      if (type === "live") {
        // For demo purposes, use revision route with label=live
        // In production, this would point to the actual live page
        return `/partial/${id}?label=live`;
      }

      if (type === "draft") {
        // For demo purposes, use revision route with label=draft
        // In production, this would point to the actual draft preview
        return `/partial/${id}?label=draft`;
      }

      if (type === "revision") {
        return `/partial/${id}${label ? `?label=${label}` : ""}`;
      }

      return "";
    },
    [parseVersionString]
  );

  // Parse URL parameters
  useEffect(() => {
    const version1Param = searchParams.get("version1") || "";
    const version2Param = searchParams.get("version2") || "";

    setVersion1(version1Param);
    setVersion2(version2Param);

    // Fetch available revisions for dropdown selection
    fetchAvailableRevisions();
  }, [searchParams, fetchAvailableRevisions]);

  // Fetch revision data when versions change
  useEffect(() => {
    if (version1) {
      fetchRevisionData(version1, "version1");
    }
    if (version2) {
      fetchRevisionData(version2, "version2");
    }
  }, [version1, version2, fetchRevisionData]);

  // Get display label for version
  const getVersionLabel = useCallback(
    (versionString: string): string => {
      const { type, id, label } = parseVersionString(versionString);

      if (type === "live") {
        return "Live";
      }

      if (type === "draft") {
        return "Draft";
      }

      if (type === "revision") {
        return `Revision ${label || "1"}`;
      }

      return versionString || "Select version";
    },
    [parseVersionString]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Split view container with full-length dividing line */}
      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Left side iframe */}
        <LeftFrame
          loading={loading}
          version={version1}
          versionData={version1Data}
          getVersionUrl={getVersionUrl}
          getVersionLabel={getVersionLabel}
        />

        {/* Full-length dividing line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[3px] h-screen z-50 bg-gray-300 transform -translate-x-1/2"></div>

        {/* Right side iframe */}
        <RightFrame
          loading={loading}
          version={version2}
          versionData={version2Data}
          getVersionUrl={getVersionUrl}
          getVersionLabel={getVersionLabel}
        />
      </div>
    </div>
  );
};

// Simple component for left iframe
interface FrameProps {
  loading: boolean;
  version: string;
  versionData: RevisionInfo | null;
  getVersionUrl: (version: string) => string;
  getVersionLabel: (version: string) => string;
}

const LeftFrame: React.FC<FrameProps> = ({
  loading,
  version,
  versionData,
  getVersionUrl,
  getVersionLabel,
}) => {
  return (
    <div className="w-1/2 h-full flex flex-col">
      {/* Version info header */}
      <div className="bg-gray-50 p-3 border-b">
        <div className="text-sm font-medium text-gray-700">
          {getVersionLabel(version)}
        </div>
        {versionData && (
          <div className="mt-1 text-xs text-gray-500">
            {versionData.isLive ? (
              <p>Live Site</p>
            ) : versionData.isDraft ? (
              <p>Draft Version</p>
            ) : (
              <p>
                Published by {versionData.publishedBy} on{" "}
                {versionData.publishedAt}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Frame content */}
      <div className="flex-grow">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : version ? (
          <iframe
            src={getVersionUrl(version)}
            className="w-full h-full"
            title={`Version ${getVersionLabel(version)}`}
            // @ts-ignore - crossOrigin is valid but TypeScript doesn't recognize it
            crossOrigin="anonymous"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No version selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple component for right iframe
const RightFrame: React.FC<FrameProps> = ({
  loading,
  version,
  versionData,
  getVersionUrl,
  getVersionLabel,
}) => {
  return (
    <div className="w-1/2 h-full flex flex-col">
      {/* Version info header */}
      <div className="bg-gray-50 p-3 border-b text-right">
        <div className="text-sm font-medium text-gray-700">
          {getVersionLabel(version)}
        </div>
        {versionData && (
          <div className="mt-1 text-xs text-gray-500">
            {versionData.isLive ? (
              <p>Live Site</p>
            ) : versionData.isDraft ? (
              <p>Draft Version</p>
            ) : (
              <p>
                Published by {versionData.publishedBy} on{" "}
                {versionData.publishedAt}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Frame content */}
      <div className="flex-grow">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : version ? (
          <iframe
            src={getVersionUrl(version)}
            className="w-full h-full"
            title={`Version ${getVersionLabel(version)}`}
            // @ts-ignore - crossOrigin is valid but TypeScript doesn't recognize it
            crossOrigin="anonymous"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No version selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;
