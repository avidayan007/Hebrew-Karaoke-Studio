import UIKit
import AVFoundation

final class ExternalDisplayManager {
    private var externalWindow: UIWindow?
    private let container = UIView(frame: .zero)
    private let playerA = AVPlayer()
    private let playerB = AVPlayer()
    private let layerA = AVPlayerLayer()
    private let layerB = AVPlayerLayer()
    private var urlA: URL?
    private var urlB: URL?

    init() {
        layerA.player = playerA
        layerB.player = playerB
        layerA.videoGravity = .resizeAspect
        layerB.videoGravity = .resizeAspect
        playerA.isMuted = true
        playerB.isMuted = true

        NotificationCenter.default.addObserver(self, selector: #selector(screenConnected(_:)), name: UIScreen.didConnectNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(screenDisconnected(_:)), name: UIScreen.didDisconnectNotification, object: nil)
        connectExistingExternalScreen()
    }

    deinit { NotificationCenter.default.removeObserver(self) }

    func setMedia(deck: String, url: URL) {
        if deck == "B" {
            urlB = url
            playerB.replaceCurrentItem(with: AVPlayerItem(url: url))
        } else {
            urlA = url
            playerA.replaceCurrentItem(with: AVPlayerItem(url: url))
        }
    }

    func applyState(deckA: [String: Any]?, deckB: [String: Any]?, cross: Double) {
        sync(player: playerA, state: deckA)
        sync(player: playerB, state: deckB)
        let x = max(0, min(1, cross))
        layerB.opacity = Float(1 - x)
        layerA.opacity = Float(x)
    }

    private func sync(player: AVPlayer, state: [String: Any]?) {
        guard let state, player.currentItem != nil else { return }
        let time = state["time"] as? Double ?? 0
        let paused = state["paused"] as? Bool ?? true
        let rate = Float(state["rate"] as? Double ?? 1)
        let now = CMTimeGetSeconds(player.currentTime())
        if now.isFinite && abs(now - time) > 0.45 {
            player.seek(to: CMTime(seconds: max(0, time), preferredTimescale: 600), toleranceBefore: CMTime(seconds: 0.08, preferredTimescale: 600), toleranceAfter: CMTime(seconds: 0.08, preferredTimescale: 600))
        }
        if paused {
            if player.rate != 0 { player.pause() }
        } else if player.rate == 0 || abs(player.rate - rate) > 0.02 {
            player.playImmediately(atRate: max(0.5, min(2.0, rate)))
        }
    }

    private func connectExistingExternalScreen() {
        if let screen = UIScreen.screens.first(where: { $0 != UIScreen.main }) { show(on: screen) }
    }

    @objc private func screenConnected(_ note: Notification) {
        guard let screen = note.object as? UIScreen, screen != UIScreen.main else { return }
        show(on: screen)
    }

    @objc private func screenDisconnected(_ note: Notification) {
        guard let screen = note.object as? UIScreen, externalWindow?.screen == screen else { return }
        externalWindow?.isHidden = true
        externalWindow = nil
    }

    private func show(on screen: UIScreen) {
        if let window = externalWindow, window.screen == screen { return }
        let window = UIWindow(frame: screen.bounds)
        window.screen = screen
        window.backgroundColor = .black

        let vc = ExternalVideoViewController(container: container, layerA: layerA, layerB: layerB)
        window.rootViewController = vc
        window.windowLevel = .normal
        window.isHidden = false
        externalWindow = window
    }
}

private final class ExternalVideoViewController: UIViewController {
    private let videoContainer: UIView
    private let layerA: AVPlayerLayer
    private let layerB: AVPlayerLayer

    init(container: UIView, layerA: AVPlayerLayer, layerB: AVPlayerLayer) {
        self.videoContainer = container
        self.layerA = layerA
        self.layerB = layerB
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        videoContainer.backgroundColor = .black
        videoContainer.frame = view.bounds
        videoContainer.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(videoContainer)
        videoContainer.layer.addSublayer(layerB)
        videoContainer.layer.addSublayer(layerA)
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        layerA.frame = videoContainer.bounds
        layerB.frame = videoContainer.bounds
    }

    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var prefersStatusBarHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }
}
