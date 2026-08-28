import neo4j from "neo4j-driver";

const uri = process.env.COGNO_URI || (typeof import.meta !== "undefined" && import.meta.env?.COGNO_URI) || "";
const user = process.env.COGNO_USER || (typeof import.meta !== "undefined" && import.meta.env?.COGNO_USER) || "";
const password = process.env.COGNO_PASSWORD || (typeof import.meta !== "undefined" && import.meta.env?.COGNO_PASSWORD) || "";

export const isDbConfigured = Boolean(uri && user && password);

export const driver = neo4j.driver(
  uri || "bolt://localhost:7687",
  neo4j.auth.basic(user, password),
  {
    connectionTimeout: 4000,
    connectionAcquisitionTimeout: 4000,
    maxConnectionLifetime: 3 * 60 * 1000,
  }
);

export async function verifyCognoConnection() {
  if (!isDbConfigured) {
    return { success: false, error: "Database environment variables not configured" };
  }
  try {
    const serverInfo = await driver.getServerInfo();
    console.log("Connected to CognoDB successfully:", serverInfo);
    return { success: true, serverInfo };
  } catch (error) {
    console.error("Failed to connect to CognoDB:", error);
    throw error;
  }
}

export default driver;

