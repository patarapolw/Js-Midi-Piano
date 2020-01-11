(function main () {
  Array.from(document.getElementsByClassName('key')).forEach((el) => {
    el.addEventListener('click', () => {
      playMedia(el)
    })
    el.innerText = el.getAttribute('data-keyboard')
  })

  const activeF = {}

  document.addEventListener('keydown', (e) => {
    const key = document.querySelector(`[data-keyboard="${e.key}"]`)
    if (key) {
      const f = key.getAttribute('data-f')
      if (!activeF[f]) {
        playMedia(key, () => new Promise((resolve) => { activeF[f] = resolve }))
      }
    }
  })

  document.addEventListener('keyup', (e) => {
    const key = document.querySelector(`[data-keyboard="${e.key}"]`)
    if (key) {
      const f = key.getAttribute('data-f')
      if (activeF[f]) {
        activeF[f]()
        delete activeF[f]
      }
    }
  })
})()

/**
 *
 * @param {HTMLElement} key
 * @param {function} [stopCb]
 */
async function playMedia (key, stopCb) {
  key.classList.add('active')
  const f = key.getAttribute('data-f')
  const m = /([+-]?\d+)([+-]\d+)/.exec(f)

  if (m) {
    var context = new AudioContext()
    var o = context.createOscillator()
    o.frequency.setTargetAtTime(
      440 * Math.pow(2, parseInt(m[1]) + parseInt(m[2]) / 12),
      context.currentTime, 0
    )
    o.connect(context.destination)
    o.start(0)
    if (stopCb) {
      await stopCb()
    } else {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    o.stop(0)
    key.classList.remove('active')
  }
}
