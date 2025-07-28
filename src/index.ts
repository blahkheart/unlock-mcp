#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();
const mode = process.env.MCP_MODE || "stdio";
if (mode === "stdio") await import("./stdio.js");
else await import("./proxy.js");