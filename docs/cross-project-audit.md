# Cross-project duplicate audit

Source-only exact-content scan; generated files, dependencies, credentials and build outputs excluded.

## wildlife_safty_website
Scanned 98 source files.
No exact duplicate source files found.

## wildlife_safty_Backend_Mongodb
Scanned 92 source files.
No exact duplicate source files found.

## wildlife_safty_mobile_app
Scanned 62 source files.
No exact duplicate source files found.

## Wildlife_safty_Backend
Scanned 10 source files.
No exact duplicate source files found.

## Feature-level decisions
- Node admin/user/medical chat services duplicated conversation ID construction. Extracted utils/conversationId.js, retaining the exact persisted format and testing reversal compatibility. Role-specific authorization, sender enrichment and audit behavior remain separate intentionally.
- Mobile AuthRepository is an application-facing facade over AuthService. Kept it: removing the facade would spread transport dependencies into screens.
- Mobile HistoryRepository reads prediction history; IdentificationRepository coordinates remote/native inference and offline persistence. These are different workflows, not interchangeable duplicates.
- Mobile offline inference and the Flask inference service target different runtimes. They must not be deleted merely because both identify snakes.
- Web AuthContext previously duplicated persisted-identity normalization at hydration and refresh. Both now call a pure tested session resolver.

Limitations: this is a targeted review, not proof of zero semantic duplication throughout the application. Mobile native-device regression has not run.
