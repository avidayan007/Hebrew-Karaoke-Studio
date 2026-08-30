import SwiftUI

@main
struct AFDDJApp: App {
    var body: some Scene {
        WindowGroup {
            AFDDJRootView()
                .ignoresSafeArea()
        }
    }
}

struct AFDDJRootView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> AFDDJViewController {
        AFDDJViewController()
    }
    func updateUIViewController(_ uiViewController: AFDDJViewController, context: Context) {}
}
