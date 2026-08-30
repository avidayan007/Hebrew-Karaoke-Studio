import UIKit
import WebKit

final class AFDDJViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    private var webView: WKWebView!
    private var folderManager: FolderAccessManager!
    private let externalDisplay = ExternalDisplayManager()

    override func viewDidLoad() {
        super.viewDidLoad(); view.backgroundColor = .black
        let content = WKUserContentController(); content.add(self, name: "afdNative")
        let config = WKWebViewConfiguration(); config.userContentController = content; config.allowsInlineMediaPlayback = true; config.mediaTypesRequiringUserActionForPlayback = []
        webView = WKWebView(frame: .zero, configuration: config); webView.navigationDelegate = self; webView.translatesAutoresizingMaskIntoConstraints = false; webView.scrollView.contentInsetAdjustmentBehavior = .never
        view.addSubview(webView); NSLayoutConstraint.activate([webView.leadingAnchor.constraint(equalTo:view.leadingAnchor),webView.trailingAnchor.constraint(equalTo:view.trailingAnchor),webView.topAnchor.constraint(equalTo:view.topAnchor),webView.bottomAnchor.constraint(equalTo:view.bottomAnchor)])
        folderManager = FolderAccessManager(presenter:self,webView:webView)
        folderManager.onMediaPrepared = { [weak self] deck, url in self?.externalDisplay.setMedia(deck: deck, url: url) }
        if let url=URL(string:"https://afd-dj.vercel.app/"){webView.load(URLRequest(url:url,cachePolicy:.reloadIgnoringLocalCacheData))}
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) { installNativeBridgeJavaScript(); folderManager.restoreLastFolder() }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name=="afdNative",let body=message.body as? [String:Any],let action=body["action"] as? String else{return}
        switch action {
        case "chooseFolder": folderManager.chooseFolder()
        case "loadMedia": guard let id=body["id"] as? String,let deck=body["deck"] as? String else{return}; folderManager.loadMedia(id:id,deck:deck)
        case "externalState":
            let a = body["A"] as? [String:Any]
            let b = body["B"] as? [String:Any]
            let cross = body["cross"] as? Double ?? 0.5
            externalDisplay.applyState(deckA: a, deckB: b, cross: cross)
        default: break
        }
    }
    private func installNativeBridgeJavaScript(){
        let js=#"""
        (()=>{
          window.AFDNative=true;
          const post=o=>window.webkit?.messageHandlers?.afdNative?.postMessage(o);
          window.AFDChooseFolder=()=>post({action:'chooseFolder'});
          const hook=()=>{const b=document.getElementById('folderBtn');if(!b||b.dataset.afdNativeHook==='1')return;b.dataset.afdNativeHook='1';b.textContent='📁 הוסף תיקייה';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.AFDChooseFolder()},true)};
          hook();new MutationObserver(hook).observe(document.documentElement,{childList:true,subtree:true});
          const sync=()=>{try{const f=document.getElementById('console'),d=f?.contentDocument;if(!d)return;const a=d.getElementById('vidA'),b=d.getElementById('vidB'),c=d.getElementById('videoCross')||d.getElementById('cross');const state=m=>m?{time:Number(m.currentTime)||0,paused:!!m.paused,rate:Number(m.playbackRate)||1}:null;post({action:'externalState',A:state(a),B:state(b),cross:Math.max(0,Math.min(1,(Number(c?.value)||50)/100))})}catch(e){}};
          setInterval(sync,250);
        })();
        """#
        webView.evaluateJavaScript(js)
    }
    deinit{webView?.configuration.userContentController.removeScriptMessageHandler(forName:"afdNative")}
}
