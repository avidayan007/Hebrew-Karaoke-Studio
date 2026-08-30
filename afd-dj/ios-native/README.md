# AFD DJ Native iPad shell

This folder starts the native iPad wrapper for AFD DJ.

## Goal
Keep the existing AFD DJ web UI in a WKWebView, but use native iPad APIs for Files/iCloud folder access.

## Folder flow
1. Native button/message calls `FolderAccessManager.chooseFolder()`.
2. iPad presents `UIDocumentPickerViewController(forOpeningContentTypes: [.folder])`.
3. The selected security-scoped directory is bookmarked.
4. The directory is recursively enumerated for supported audio/video files.
5. Metadata is sent to the existing AFD DJ UI through `window.AFDNativeFolderFiles(items)`.
6. On next launch call `restoreLastFolder()` to reopen the saved folder permission when available.

## Next bridge work
Add a WKScriptMessageHandler named `afdNative` so the existing `הוסף תיקייה` button can request `chooseFolder()` directly. Add a native media URL handler so LOAD A/B can open security-scoped media without copying the whole library into the app sandbox.
