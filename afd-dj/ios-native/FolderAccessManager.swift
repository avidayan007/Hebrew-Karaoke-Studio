import UIKit
import UniformTypeIdentifiers
import WebKit

final class FolderAccessManager: NSObject, UIDocumentPickerDelegate {
    weak var presenter: UIViewController?
    weak var webView: WKWebView?
    private let bookmarkKey = "AFDDJSelectedFolderBookmark"

    init(presenter: UIViewController, webView: WKWebView) {
        self.presenter = presenter
        self.webView = webView
        super.init()
    }

    func chooseFolder() {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.folder], asCopy: false)
        picker.delegate = self
        picker.allowsMultipleSelection = false
        presenter?.present(picker, animated: true)
    }

    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let url = urls.first else { return }
        saveBookmark(url)
        sendFolderToWeb(url)
    }

    func restoreLastFolder() {
        guard let data = UserDefaults.standard.data(forKey: bookmarkKey) else { return }
        do {
            var stale = false
            let url = try URL(resolvingBookmarkData: data, options: [], relativeTo: nil, bookmarkDataIsStale: &stale)
            if stale { saveBookmark(url) }
            sendFolderToWeb(url)
        } catch {
            UserDefaults.standard.removeObject(forKey: bookmarkKey)
        }
    }

    private func saveBookmark(_ url: URL) {
        guard url.startAccessingSecurityScopedResource() else { return }
        defer { url.stopAccessingSecurityScopedResource() }
        do {
            let data = try url.bookmarkData(options: .minimalBookmark, includingResourceValuesForKeys: nil, relativeTo: nil)
            UserDefaults.standard.set(data, forKey: bookmarkKey)
        } catch { }
    }

    private func sendFolderToWeb(_ folder: URL) {
        guard folder.startAccessingSecurityScopedResource() else { return }
        defer { folder.stopAccessingSecurityScopedResource() }
        let fm = FileManager.default
        let keys: [URLResourceKey] = [.isRegularFileKey, .nameKey, .fileSizeKey, .contentModificationDateKey]
        let exts = Set(["mp3","wav","m4a","aac","flac","ogg","mp4","mov","m4v","webm"])
        var items: [[String: Any]] = []
        if let en = fm.enumerator(at: folder, includingPropertiesForKeys: keys, options: [.skipsHiddenFiles]) {
            for case let u as URL in en {
                guard exts.contains(u.pathExtension.lowercased()) else { continue }
                let v = try? u.resourceValues(forKeys: Set(keys))
                guard v?.isRegularFile == true else { continue }
                items.append(["name": u.lastPathComponent, "path": u.path, "size": v?.fileSize ?? 0])
            }
        }
        guard let data = try? JSONSerialization.data(withJSONObject: items), let json = String(data: data, encoding: .utf8) else { return }
        webView?.evaluateJavaScript("window.AFDNativeFolderFiles && window.AFDNativeFolderFiles(\(json));")
    }
}
