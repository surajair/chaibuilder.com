"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { RightFrame } from "./components/right-iframe";
import { LeftFrame } from "./components/left-ifram";

interface RevisionInfo {
  id: string;
  type?: string;
  number?: number;
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
  const getVersionInfo = (versionString: string): RevisionInfo => {
    if (!versionString) return {
      id: '',
      number: 0,
      publishedBy: 'Unknown',
      publishedAt: new Date().toISOString(),
    };

    const match = versionString.match(/(revision|draft|live):([^:?]+)/);
    if (!match) return {
      id: versionString,
      number: 0,
      publishedBy: 'Unknown',
      publishedAt: new Date().toISOString(),
    };

    const [_, type, id] = match;
    const labelMatch = versionString.match(/label=([^&]+)/);
    const label = labelMatch ? labelMatch[1] : '1';

    switch (type) {
      case 'live':
        return {
          id,
          number: 0,
          publishedBy: 'System',
          publishedAt: new Date().toISOString(),
          isLive: true,
        };
      case 'draft':
        return {
          id,
          number: 0,
          publishedBy: 'Current Draft',
          publishedAt: new Date().toISOString(),
          isDraft: true,
        };
      case 'revision':
      default:
        return {
          id,
          number: parseInt(label) || 1,
          publishedBy: `Revision ${label}`,
          publishedAt: new Date().toISOString(),
        };
    }
  };

  const getVersionUrl = (versionString: string): string => {
    if (!versionString) return '';
    
    if (versionString.startsWith('http') || versionString.startsWith('/')) {
      return versionString;
    }
    
    // Otherwise, construct the URL
    const lang = new URLSearchParams(window.location.search).get('lang') || 'en';
    const baseUrl = '/revision';
    
    // Check if it's already in the correct format
    if (versionString.startsWith('revision:') || 
        versionString.startsWith('draft:') || 
        versionString.startsWith('live:')) {
      return `${baseUrl}/${versionString}${versionString.includes('?') ? '&' : '?'}lang=${lang}`;
    }
    
    // Default to revision if no type specified
    return `${baseUrl}/revision:${versionString}?lang=${lang}`;
  };

  // Parse URL parameters
  useEffect(() => {
    const version1Param = searchParams.get("version1") || "";
    const version2Param = searchParams.get("version2") || "";

    setVersion1(version1Param);
    setVersion2(version2Param);
    
    // Set version data directly from URL parameters
    if (version1Param) {
      setVersion1Data(getVersionInfo(version1Param));
    }
    if (version2Param) {
      setVersion2Data(getVersionInfo(version2Param));
    }
    
    setLoading(false);
  }, [searchParams]);

  // Get display label for version
  const getVersionLabel = (versionString: string): string => {
    if (!versionString) return "Select version";
    
    if (versionString.includes('live:')) return "Live";
    if (versionString.includes('draft:')) return "Draft";
    
    const revisionMatch = versionString.match(/revision:[^:]+:(\d+)/);
    if (revisionMatch) {
      return `Revision ${revisionMatch[1]}`;
    }
    
    return versionString;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Left Version Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-medium text-gray-900">Version 1</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {version1Data?.type || 'draft'}
              </span>
            </div>
            {version1Data && (
              <p className="mt-1 text-sm text-gray-500">
                Published by {version1Data.publishedBy} at {new Date(version1Data.publishedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Center Language Selector */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <select 
                className="block w-full  py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-[10px]"
                value={searchParams.get('lang') || 'en'}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('lang', e.target.value);
                  window.location.search = newParams.toString();
                }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          {/* Right Version Info */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {version2Data?.type || 'revision'}
              </span>
              <h2 className="text-lg font-medium text-gray-900">Version 2</h2>
            </div>
            {version2Data && (
              <p className="mt-1 text-sm text-gray-500">
                Published by {version2Data.publishedBy} at {new Date(version2Data.publishedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex flex-1 overflow-hidden">
        <LeftFrame
          loading={loading}
          version={version1}
          getVersionUrl={getVersionUrl}
          getVersionLabel={getVersionLabel}
        />
        <div className="w-px bg-gray-200"></div>
        <RightFrame
          loading={loading}
          version={version2}
          getVersionUrl={getVersionUrl}
          getVersionLabel={getVersionLabel}
        />
      </div>
    </div>
  );
};

export interface FrameProps {
  loading: boolean;
  version: string;
  getVersionUrl: (version: string) => string;
  getVersionLabel: (version: string) => string;
}

export default ComparisonPage;
