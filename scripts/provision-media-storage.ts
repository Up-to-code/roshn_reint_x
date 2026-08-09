import "dotenv/config";
import { provisionMediaStorage } from "../lib/media-storage/media-server";

const results = await provisionMediaStorage();
for (const result of results) console.log(`${result.name}: ${result.status}`);
