import { initBotId } from 'botid/client/core'

export function initializeBotId() {
  initBotId({
    protect: [{ path: '/api/sensitive', method: 'POST' }],
  })
}
