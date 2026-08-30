import UIKit
import UniformTypeIdentifiers
import WebKit

final class FolderAccessManager: NSObject, UIDocumentPickerDelegate {
    weak var presenter: UIViewController?
    weak var webView: WKWebView?
    var onMediaPrepared: ((String, URL) -> Void)?
    private let bookmarkKey = "AFDDJSelectedFolderBookmark"
    private var folderURL: URL?
    private var itemsByID: [String: URL] = [:]

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
        folderURL = url
        saveBookmark(url)
        sendFolderToWeb(url)
    }

    func restoreLastFolder() {
        guard let data = UserDefaults.standard.data(forKey: bookmarkKey) else { return }
        do {
            var stale = false
            let url = try URL(resolvingBookmarkData: data, options: [], relativeTo: nil, bookmarkDataIsStale: &stale)
            if stale { saveBookmark(url) }
            folderURL = url
            sendFolderToWeb(url)
        } catch { UserDefaults.standard.removeObject(forKey: bookmarkKey) }
    }

    func loadMedia(id: String, deck: String) {
        guard let source = itemsByID[id], let folder = folderURL else { sendError("הקובץ לא נמצא בתיקייה"); return }
        guard folder.startAccessingSecurityScopedResource() else { sendError("אין הרשאה לתיקייה"); return }
        defer { folder.stopAccessingSecurityScopedResource() }
        var coordinationError: NSError?
        NSFileCoordinator().coordinate(readingItemAt: source, options: [], error: &coordinationError) { coordinatedURL in
            do {
                let ext = coordinatedURL.pathExtension
                let safeDeck = deck == "B" ? "B" : "A"
                let dst = FileManager.default.temporaryDirectory.appendingPathComponent("AFDDJ-\(safeDeck).\(ext)")
                try? FileManager.default.removeItem(at: dst)
                try FileManager.default.copyItem(at: coordinatedURL, to: dst)
                DispatchQueue.main.async { [weak self] in
                    self?.onMediaPrepared?(safeDeck, dst)
                    self?.sendLoaded(deck: safeDeck, fileURL: dst, name: coordinatedURL.lastPathComponent)
                }
            } catch { DispatchQueue.main.async { [weak self] in self?.sendError("לא ניתן להכין את הקובץ לנגן") } }
        }
        if coordinationError != nil { sendError("שגיאה בקריאת הקובץ מ‑Files / iCloud") }
    }

    private func saveBookmark(_ url: URL) {
        guard url.startAccessingSecurityScopedResource() else { return }
        defer { url.stopAccessingSecurityScopedResource() }
        do { UserDefaults.standard.set(try url.bookmarkData(options: .minimalBookmark, includingResourceValuesForKeys: nil, relativeTo: nil), forKey: bookmarkKey) } catch { }
    }

    private func sendFolderToWeb(_ folder: URL) {
        guard folder.startAccessingSecurityScopedResource() else { sendError("אין הרשאה לתיקייה"); return }
        defer { folder.stopAccessingSecurityScopedResource() }
        itemsByID.removeAll()
        let keys: [URLResourceKey] = [.isRegularFileKey,.fileSizeKey,.contentModificationDateKey]
        let exts = Set(["mp3","wav","m4a","aac","flac","ogg","mp4","mov","m4v","webm"])
        var items: [[String: Any]] = []
        var coordinationError: NSError?
        NSFileCoordinator().coordinate(readingItemAt: folder, options: [], error: &coordinationError) { coordinatedFolder in
            if let en = FileManager.default.enumerator(at: coordinatedFolder, includingPropertiesForKeys: keys, options: [.skipsHiddenFiles]) {
                for case let u as URL in en {
                    guard exts.contains(u.pathExtension.lowercased()) else { continue }
                    let v = try? u.resourceValues(forKeys: Set(keys)); guard v?.isRegularFile == true else { continue }
                    let id = UUID().uuidString; itemsByID[id] = u
                    items.append(["id":id,"name":u.lastPathComponent,"size":v?.fileSize ?? 0])
                }
            }
        }
        guard coordinationError == nil, let data = try? JSONSerialization.data(withJSONObject: items), let json = String(data:data,encoding:.utf8) else { sendError("לא ניתן לקרוא את התיקייה"); return }
        DispatchQueue.main.async { [weak self] in self?.webView?.evaluateJavaScript("window.AFDNativeFolderFiles && window.AFDNativeFolderFiles(\(json));") }
    }

    private func sendLoaded(deck: String, fileURL: URL, name: String) {
        let payload:[String:String] = ["deck":deck,"url":fileURL.absoluteString,"name":name]
        guard let d=try? JSONSerialization.data(withJSONObject:payload),let j=String(data:d,encoding:.utf8) else{return}
        webView?.evaluateJavaScript("window.AFDNativeMediaReady && window.AFDNativeMediaReady(\(j));")
    }
    private func sendError(_ text:String) {
        guard let d=try? JSONSerialization.data(withJSONObject:["message":text]),let j=String(data:d,encoding:.utf8) else{return}
        DispatchQueue.main.async { [weak self] in self?.webView?.evaluateJavaScript("window.AFDNativeError && window.AFDNativeError(\(j));") }
    }
}
