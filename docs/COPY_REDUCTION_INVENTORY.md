# Public Copy Reduction Inventory

## Classification

### Removed as redundant or marketing-led

- Repeated platform orientation, product “principles,” editorial manifestos, and “how to read this page” sections.
- FAQ blocks that restated adjacent headings, warnings, routes, or controls.
- Repeated card descriptions where a title, state, metric, or destination already answered the question.
- Decorative workflow explanations, generic institutional language, and defensive descriptions of what the product is not.
- Duplicate auth headings, access-rail descriptions, API principles, status explanations, and placeholder conversations.

### Migrated as product or architecture knowledge

- Product boundaries, workflows, oracle behavior, risk discipline, research graduation, market-structure positions, and Capital Windows responsibilities moved to [PRODUCT_NARRATIVE.md](./PRODUCT_NARRATIVE.md).
- Stable terminology moved to [PRODUCT_GLOSSARY.md](./PRODUCT_GLOSSARY.md).
- Capital Windows implementation detail remains in [UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md](./UNISWAP_V4_PERMISSIONED_LIQUIDITY_ARCHITECTURE.md).
- Route ownership and discovery policy remain in [PRODUCT_MAP.md](./PRODUCT_MAP.md).

### Retained near implementation

- Controls, form labels, errors, status values, table headers, data-room state, allocation actions, API paths, risk parameters, and legal warnings remain visible where used.
- Existing inline comments remain limited to non-obvious technical behavior; removed narrative was not converted into code comments.

### Retained for agents and discovery

- `apps/ultramar/public/llms.txt` keeps the canonical product and compliance summary.
- `apps/ultramar/public/llms-full.txt` keeps route-level research and press summaries, product scope, and automated-access guidance.
- JSON-LD and SEO metadata retain concise, route-specific descriptions without adding visible page copy.

## Editorial decision

Research and press routes now function as concise position summaries that route users to the relevant product area. Long article bodies were removed from runtime content models after their durable claims were captured in documentation and LLM discovery files.
