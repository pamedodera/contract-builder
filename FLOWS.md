# App Flows

Each flow is accessed via the `?flow=` URL parameter. No navigation UI is shown — switch flows by editing the URL directly.

## Available Flows

| Flow | URL | Description |
|------|-----|-------------|
| Word Shell | `/?flow=word-shell` | MS Word UI chrome with Definely as an Add-in. **Default landing page.** |
| Actions Flow – Option B | `/?flow=action-space-b` | Action space sidebar with context chips, insert phases, and definitions |
| Future Proposals | `/?flow=definely-brand` | Definely branded sidebar with Home / Review / Library tabs |
| Actions Flow | `/?flow=action-space` | Original action space sidebar (Vault / Draft / Proof / Cascade / Enhance tabs) |

## Examples

```
http://localhost:5173/?flow=word-shell
http://localhost:5173/?flow=action-space-b
http://localhost:5173/?flow=definely-brand
```
