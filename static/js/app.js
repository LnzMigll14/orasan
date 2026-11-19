/*
 * Orasan static prototype: the only JavaScript.
 * - Start/stop the timer (header pill and mobile dock stay in sync)
 * - Show a toast with Undo when the timer stops
 * Content is all hard-coded in the HTML; nothing here renders data.
 */
(function () {
  const timers = document.querySelectorAll('[data-timer]')
  const clocks = document.querySelectorAll('[data-timer-clock]')
  let startedAt = 0
  let tick = 0

  const pad = (n) => String(n).padStart(2, '0')
  const format = (s) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`

  function setRunning(running) {
    timers.forEach((el) => {
      el.classList.toggle('is-running', running)
      el.querySelectorAll('[data-when]').forEach((btn) => {
        const visible = (btn.dataset.when === 'running') === running
        btn.tabIndex = visible ? 0 : -1
        btn.setAttribute('aria-hidden', String(!visible))
      })
    })
  }

  function render() {
    const s = Math.floor((Date.now() - startedAt) / 1000)
    clocks.forEach((c) => (c.textContent = format(s)))
    return s
  }

  function start() {
    startedAt = Date.now()
    render()
    tick = setInterval(render, 1000)
    setRunning(true)
  }

  function stop() {
    const s = render()
    clearInterval(tick)
    setRunning(false)
    showToast(`Saved ${format(s)} to Brand refresh.`, 'Undo')
  }

  document.addEventListener('click', async (e) => {
    if (e.target.closest('[data-timer-start]')) return start()
    if (e.target.closest('[data-timer-stop]')) return stop()

    // Copy buttons: data-copy holds the text, data-copy-label names it in the toast.
    const copy = e.target.closest('[data-copy]')
    if (copy) {
      const what = copy.dataset.copyLabel || 'Detail'
      try {
        await navigator.clipboard.writeText(copy.dataset.copy)
        showToast(`${what} copied.`)
      } catch {
        showToast('Could not copy. Select the text and copy it instead.')
      }
      return
    }

    // Prototype-only actions that just confirm with a toast.
    const say = e.target.closest('[data-toast]')
    if (say) showToast(say.dataset.toast)

    // Switches flip aria-checked; CSS draws the state.
    const sw = e.target.closest('[data-toggle]')
    if (sw) sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'))
  })

  /* Toast: rises in, waits 5s (paused on hover), leaves faster than it came. */
  const region = document.querySelector('[data-toast-region]')
  function showToast(message, actionLabel) {
    if (!region) return
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.innerHTML = `<span></span>${actionLabel ? '<button type="button" class="toast__action"></button>' : ''}`
    toast.firstChild.textContent = message
    const action = toast.querySelector('.toast__action')
    if (action) action.textContent = actionLabel
    region.append(toast)
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('is-visible')))

    let remaining = 5000
    let since = Date.now()
    let timer = setTimeout(leave, remaining)
    function leave() {
      toast.classList.add('is-leaving')
      setTimeout(() => toast.remove(), 160)
    }
    toast.addEventListener('mouseenter', () => {
      clearTimeout(timer)
      remaining -= Date.now() - since
    })
    toast.addEventListener('mouseleave', () => {
      since = Date.now()
      timer = setTimeout(leave, remaining)
    })
    if (action) action.addEventListener('click', leave)
  }
})()
