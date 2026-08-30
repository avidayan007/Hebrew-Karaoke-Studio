# AFD DJ iPad Native — build

The native shell keeps the existing AFD DJ UI in WKWebView and adds native Files/iCloud folder access.

## Source files
- `AFDDJApp.swift` — app entry point.
- `AFDDJViewController.swift` — WKWebView + JS/native message bridge.
- `FolderAccessManager.swift` — folder picker, bookmark, coordinated folder/file access.
- `project.yml` — XcodeGen project definition for iPad, landscape, iOS 16+.

## Generate/open
On a Mac with Xcode and XcodeGen:

```sh
cd afd-dj/ios-native
xcodegen generate
open AFDDJ.xcodeproj
```

Select an Apple Development Team, connect the iPad, select it as Run Destination, then Run.

## Functional verification on a real iPad
1. AFD DJ opens full-screen landscape and loads the current hosted Workstation.
2. Tap `הוסף תיקייה`; Apple Files must show folder selection (not multi-file selection).
3. Select an iCloud Drive folder. The Local Library must show supported media recursively.
4. Close/relaunch; the saved folder bookmark should restore when permission remains valid.
5. Tap LOAD A and LOAD B. Native code coordinates a read and copies only the selected media to the app cache, then returns its file URL to the web UI.
6. Confirm PLAY/seek/pitch/EQ/volume for local media and A/V MIX behavior.
7. Revoke Files & Folders permission in Settings and verify the app fails gracefully and lets the folder be selected again.

## Important
A real iPad/Xcode run is still required for final validation of iCloud File Provider behavior and code signing. Web/Vercel alone cannot exercise the native folder picker or security-scoped URLs.
