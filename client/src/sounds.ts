
let tapSound: HTMLAudioElement | null = null

export function playTapSound() {
  if (!tapSound) {
    tapSound = new window.Audio("/sounds/tap.mp3")
  }
          tapSound.volume = 0.4

  tapSound.currentTime = 0
  void tapSound.play().catch(() => {})
}
