import { config } from "dotenv";

export type AppSettings = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
};

config();

const settings: AppSettings = {
  clientId: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",
  tenantId: process.env.TENANT_ID || "",
};

export default settings;
