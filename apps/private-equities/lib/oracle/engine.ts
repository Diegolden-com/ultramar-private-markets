
export interface SolvencyMetrics {
    assets: number;
    liabilities: number;
    equity: number;
    solvencyRatio: number; // (Assets - Liabilities) / Liabilities
    liquidityRatio: number; // Current Assets / Current Liabilities
    timestamp: number;
}

interface QboColData {
    value?: string;
}

interface QboRow {
    Summary?: { ColData?: QboColData[] };
    ColData?: QboColData[];
    Rows?: { Row?: QboRow[] };
}

interface QboReport {
    Rows?: { Row?: QboRow[] };
}

const getText = (col?: QboColData): string => (typeof col?.value === 'string' ? col.value : '');

const getRootRows = (report: unknown): QboRow[] => {
    if (!report || typeof report !== 'object') return [];
    const rows = (report as QboReport).Rows?.Row;
    return Array.isArray(rows) ? rows : [];
};

export function calculateFinancials(balanceSheet: unknown): SolvencyMetrics {
    // This is a simplified parser for QuickBooks Balance Sheet JSON structure
    // In a real app, we would recursively traverse the rows to find specific account types.

    // Mock parsing logic assuming standard QBO Balance Sheet format
    // Structure: Rows -> Section (Assets) -> Rows -> Section (Current Assets) -> Summary -> ColData

    // For V1, we will implement a robust traverser in future. 
    // Here we assume the input might be mocking the specific values if raw parsing fails,
    // or we implement a basic search.

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
function getAmountFromReport(report: unknown, targetName: string): number {
    const rows = getRootRows(report);
    if (!rows.length) return 0;

    let foundValue = 0;
    const target = targetName.toLowerCase();

    const traverse = (rowsToCheck: QboRow[]) => {
        for (const row of rowsToCheck) {
            // Check Summary first as it often holds "Total X"
            if (row.Summary?.ColData?.[0]) {
                const label = getText(row.Summary.ColData[0]).trim().toLowerCase();
                if (label === target) {
                    const val = parseFloat(getText(row.Summary.ColData[1]));
                    if (!isNaN(val)) foundValue = val;
                    return;
                }
            }
            // Check Data Row
            if (row.ColData?.[0]) {
                const label = getText(row.ColData[0]).trim().toLowerCase();
                if (label === target) {
                    const val = parseFloat(getText(row.ColData[1]));
                    if (!isNaN(val)) foundValue = val;
                    return;
                }
            }

            if (row.Rows?.Row && row.Rows.Row.length > 0) {
                traverse(row.Rows.Row);
            }
        }
    }

    traverse(rows);
    return foundValue;
}
