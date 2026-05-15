# Ultramar Capital Interface Redesign

Stitch project export for project `5008225095919300691`.

The raw Stitch export is preserved at:

- `source/stitch_ultramar_capital_interface_redesign.zip`

Extracted files are under:

- `export/stitch_ultramar_capital_interface_redesign/`

## Screen Mapping

| Requested screen | Stitch screen ID | Exported files |
| --- | --- | --- |
| Design System | `asset-stub-assets-9c35ed8fb1fb43fd94d01fb7b4220d76-1778870091280` | `governed_capital_terminal/DESIGN.md` |
| Private Equities \| Ultramar Capital | `3f0e310da276438eaa56fc573c5c8a10` | `private_equities_ultramar_capital/code.html`, `private_equities_ultramar_capital/screen.png`, `private_equities_ultramar_capital/assets/industrial-facility.png` |
| Home \| Ultramar Capital | `d7444e1db89f4e06b7c3e90a6815b097` | `home_ultramar_capital/code.html`, `home_ultramar_capital/screen.png` |
| Arbitrage Hedge Fund \| Ultramar Capital | `084c65b454834bb9ad124fdc06019469` | `arbitrage_hedge_fund_ultramar_capital/code.html`, `arbitrage_hedge_fund_ultramar_capital/screen.png` |
| Lavanderias CX \| Private Equities Asset Detail | `09318ca86f404d6c88271eab7bdc5500` | `lavanderias_cx_private_equities_asset_detail/code.html`, `lavanderias_cx_private_equities_asset_detail/screen.png` |
| Signals Terminal \| Arbitrage Hedge Fund | `4bdd548a47494ffcabe288c21fc139d6` | `signals_terminal_arbitrage_hedge_fund/code.html`, `signals_terminal_arbitrage_hedge_fund/screen.png` |
| Risk Management \| Arbitrage Hedge Fund | `5b55f4bb1aac4490a59d947ac50e1bc6` | `risk_management_arbitrage_hedge_fund/code.html`, `risk_management_arbitrage_hedge_fund/screen.png` |

## Notes

- Stitch exported the Design System as `DESIGN.md`, not as a `screen.png` / `code.html` pair.
- The six product screens each include both the generated HTML and PNG screenshot from Stitch.
- The hosted image referenced by the Private Equities HTML was downloaded with `curl -L` and the extracted HTML was updated to reference the local asset. The raw zip remains unmodified in `source/`.
