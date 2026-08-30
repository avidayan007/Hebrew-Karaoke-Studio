import UIKit
import WebKit

final class AFDDJViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    private var webView: WKWebView!
    private var folderManager: FolderAccessManager!

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black

        let content = WKUserContentController()
        content.add(self, name: "afdNative")

        let config = WKWebViewConfiguration()
        config.userContentController = content
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        folderManager = FolderAccessManager(presenter: self, webView: webView)
        if let url = URL(string: "https://afd-dj.vercel.app/") {
            webView.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData))
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        installNativeBridgeJavaScript()
        folderManager.restoreLastFolder()
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "afdNative" else { return }
        if let body = message.body as? [String: Any], body["action"] as? String == "chooseFolder" {
            folderManager.chooseFolder()
        }
    }

    private func installNativeBridgeJavaScript() {
        let js = #"""
        (() => {
          window.AFDNative = true;
          window.AFDChooseFolder = () => window.webkit?.messageHandlers?.afdNative?.postMessage({action:'chooseFolder'});
          const hook = () => {
            const b = document.getElementById('folderBtn');
            if (!b || b.dataset.afdNativeHook === '1') return;
            b.dataset.afdNativeHook = '1';
            b.textContent = '📁 הוסף תיקייה';
            b.addEventListener('click', (e) => {
              e.preventDefault(); e.stopImmediatePropagation(); window.AFDChooseFolder();
            }, true);
          };
          hook(); new MutationObserver(hook).observe(document.documentElement,{childList:true,subtree:true});
        })();
        """#
        webView.evaluateJavaScript(js)
    }

    deinit {
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: "afdNative")
    }
}