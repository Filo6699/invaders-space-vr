const LABELS = {
  'immersive-ar': 'PLAY IN AR',
  'immersive-vr': 'PLAY IN VR',
}

export async function addXRButtons(container, renderer, overlay) {
  if (!navigator.xr) return

  for (const mode of Object.keys(LABELS)) {
    const supported = await navigator.xr.isSessionSupported(mode).catch(() => false)
    if (!supported) continue

    const button = document.createElement('button')
    button.textContent = LABELS[mode]
    button.onclick = async () => {
      const session = await navigator.xr.requestSession(mode, {
        optionalFeatures: ['dom-overlay'], // html hud on android
        domOverlay: { root: overlay },
      })
      await renderer.xr.setSession(session)
    }
    container.appendChild(button)
  }
}
