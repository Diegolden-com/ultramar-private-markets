import { getBalanceSheet } from '@/lib/quickbooks/service';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env' });

async function main() {
    try {
        console.log("Fetching Balance Sheet...");
        // Use the same hardcoded ID we used in the callback
        const userId = 'user_123';

        const report = await getBalanceSheet(userId);

        const outputPath = path.join(process.cwd(), 'debug_balance_sheet.json');
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

        console.log(`Report saved to ${outputPath}`);
    } catch (e) {
        console.error("Error fetching report:", e);
    }
}

main();
