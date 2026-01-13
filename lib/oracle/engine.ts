
export interface SolvencyMetrics {
    assets: number;
    liabilities: number;
    equity: number;
    solvencyRatio: number; // (Assets - Liabilities) / Liabilities
    liquidityRatio: number; // Current Assets / Current Liabilities
    timestamp: number;
}

export function calculateFinancials(balanceSheet: any): SolvencyMetrics {
    // This is a simplified parser for QuickBooks Balance Sheet JSON structure
    // In a real app, we would recursively traverse the rows to find specific account types.

    // Mock parsing logic assuming standard QBO Balance Sheet format
    // Structure: Rows -> Section (Assets) -> Rows -> Section (Current Assets) -> Summary -> ColData

    // For V1, we will implement a robust traverser in future. 
    // Here we assume the input might be mocking the specific values if raw parsing fails,
    // or we implement a basic search.

    // Let's implement a helper to find values by simplified row label matching
    const findRowValue = (rows: any[], label: string): number => {
        for (const row of rows) {
            if (row.type === 'Data' && row.ColData && row.ColData[0].value === label) {
                return parseFloat(row.ColData[1].value); // Assuming col 1 is the total
            }
            if (row.Rows && row.Rows.Row) {
                const res = findRowValue(row.Rows.Row, label);
                if (res !== -1) return res;
            }
            if (row.Summary && row.Summary.ColData) {
                // Often the section total is in Summary
                // Check section header? QBO is tricky.
                // Let's look for "Total {Label}"
            }
        }
        return -1; // Not found
    };

    // For now, let's assume we extract these generic totals. 
    // In a real implementation we'd need exact mapping to QBO account types.
    const totalAssets = getAmountFromReport(balanceSheet, 'Total Assets');
    const totalLiabilities = getAmountFromReport(balanceSheet, 'Total Liabilities');
    const totalEq = getAmountFromReport(balanceSheet, 'Total Equity');

    const solvency = totalLiabilities === 0 ? 100 : (totalAssets - totalLiabilities) / totalLiabilities;

    return {
        assets: totalAssets,
        liabilities: totalLiabilities,
        equity: totalEq,
        solvencyRatio: solvency,
        liquidityRatio: 0, // TODO: Extract Current Assets/Liabilities for precision
        timestamp: Date.now()
    };
}

// Helper to traverse QBO report JSON
function getAmountFromReport(report: any, targetName: string): number {
    if (!report || !report.Rows || !report.Rows.Row) return 0;

    let foundValue = 0;

    const traverse = (rows: any[]) => {
        for (const row of rows) {
            // Check Summary first as it often holds "Total X"
            if (row.Summary && row.Summary.ColData && row.Summary.ColData[0]) {
                const label = row.Summary.ColData[0].value.toLowerCase();
                if (label.includes(targetName.toLowerCase())) {
                    const val = parseFloat(row.Summary.ColData[1].value);
                    if (!isNaN(val)) foundValue = val;
                    return;
                }
            }
            // Check Data Row
            if (row.ColData && row.ColData[0]) {
                const label = row.ColData[0].value.toLowerCase();
                if (label.includes(targetName.toLowerCase())) {
                    const val = parseFloat(row.ColData[1].value);
                    if (!isNaN(val)) foundValue = val;
                    return;
                }
            }

            if (row.Rows && row.Rows.Row) {
                traverse(row.Rows.Row);
            }
        }
    }

    traverse(report.Rows.Row);
    return foundValue;
}
