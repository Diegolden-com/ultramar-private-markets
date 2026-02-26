import { calculateFinancials } from '@/lib/oracle/engine';
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        const jsonPath = path.join(process.cwd(), 'debug_balance_sheet.json');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const balanceSheet = JSON.parse(rawData);

        console.log("Testing calculateFinancials with debug JSON...");
        const metrics = calculateFinancials(balanceSheet);

        console.log("Calculated Metrics:");
        console.log(JSON.stringify(metrics, null, 2));

        if (metrics.assets > 0) {
            console.log("SUCCESS: Assets parsed correctly!");
        } else {
            console.log("FAILURE: Assets still 0.");
        }
    } catch (e) {
        console.error("Error testing parser:", e);
    }
}

main();
