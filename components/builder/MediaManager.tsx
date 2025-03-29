"use client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  ScrollArea,
} from "@chaibuilder/sdk/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface UploadcareFile {
  original_file_url: string;
  uuid: string;
}

interface UploadcareResponse {
  results: UploadcareFile[];
}

export default function MediaManager({
  onSelect,
}: {
  onSelect: (url: string) => void;
}) {
  const queryClient = useQueryClient();
  const { data: fetchedImages } = useQuery<UploadcareResponse>({
    queryKey: ["uploadcare-images"],
    queryFn: async () => {
      const response = await fetch("/chai/api/uploadcare");
      return response.json();
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <h2 className="text-base font-bold">Upload Image</h2>
      <Alert variant="destructive">
        {/* TODO: Remove this alert. */}
        <AlertTitle>Note:</AlertTitle>
        <AlertDescription>
          You can Implement your own media manager by using the custom API or
          DAM solutions.
          <br />
          Edit: app/(chaibuilder)/chai/MediaManager.tsx
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2 h-full overflow-hidden grow z-40">
        {fetchedImages?.results?.length &&
        fetchedImages?.results?.length > 0 ? (
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-3 gap-2 bg-white">
              {fetchedImages?.results?.map((image, index) => (
                <div
                  key={image.uuid}
                  className="relative group overflow-hidden"
                  onClick={() => onSelect(image.original_file_url)}>
                  <Image
                    src={image.original_file_url}
                    alt={`Uploaded image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-fit object-cover rounded-lg cursor-pointer hover:scale-105 transition-all ease-linear"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl h-full flex flex-col items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
            <h3 className=" text-sm font-medium text-gray-900">No images</h3>
            <p className="text-xs text-gray-500">
              Start uploading images by selecting files above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
