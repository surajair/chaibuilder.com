import { createHmac, randomBytes } from "crypto";

export const encodedApiKey = (
  userId: string,
  appId: string,
  secretKey: string
): string => {
  // Generate a random component (16 bytes = 32 hex characters)
  const randomizer = randomBytes(4).toString("hex");
  const timestamp = Date.now();
  const data = `${randomizer}#${userId}#${appId}#${timestamp}`;

  const hmac = createHmac("sha256", secretKey);
  hmac.update(data);
  const signature = hmac.digest("hex");
  const apiKey = Buffer.from(`${data}:${signature}`).toString("base64");
  return apiKey;
};

export const decodedApiKey = (
  apiKey: string,
  secretKey: string
): {
  isValid: boolean;
  data?: { userId: string; appId: string; timestamp: number };
} => {
  try {
    // Decode the base64 string
    const decoded = Buffer.from(apiKey, "base64").toString("utf-8");
    const [data, signature] = decoded.split(":");
    if (!data || !signature) return { isValid: false };

    // Verify the signature
    const hmac = createHmac("sha256", secretKey);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    if (signature !== expectedSignature) return { isValid: false };

    // Parse the data - now randomComponent is first
    const [, userId, appId, timestamp] = data.split("#");
    if (!userId || !appId || !timestamp) return { isValid: false };

    return {
      isValid: true,
      data: {
        userId,
        appId,
        timestamp: parseInt(timestamp, 10),
      },
    };
  } catch (error) {
    return { isValid: false };
  }
};
