import neo4j from "neo4j-driver";

const uri = process.env.COGNO_URI || (typeof import.meta !== "undefined" && import.meta.env?.COGNO_URI) || "";
const user = process.env.COGNO_USER || (typeof import.meta !== "undefined" && import.meta.env?.COGNO_USER) || "";
const password = process.env.COGNO_PASSWORD || (typeof import.meta !== "undefined" && import.meta.env?.COGNO_PASSWORD) || "";

export const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(user, password)
);

export async function verifyCognoConnection() {
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
