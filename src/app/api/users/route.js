import fs from "fs";
import path from "path";
import Papa from "papaparse";

let cachedData = null;

export async function GET(req) {
    if (!cachedData) {
        const filePath = path.join(process.cwd(), "public", "users.csv");
        const file = fs.readFileSync(filePath, "utf8");
        const { data } = Papa.parse(file, { header: true });
        cachedData = data; 
    }
    return cachedData;
}

const { searchParams } = new URL(req.url);
const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "20");
const start = (page - 1) * limit;
const end = start + limit;

return new Response(JSON.stringify({
    users: data.slice(start, end),
    total: data.length,
    page,
    pages: Math.ceil(data.length / limit)
}), {
    headers: { "Content-Type": "application/json" },
});

