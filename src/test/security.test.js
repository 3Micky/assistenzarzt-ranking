import { describe, expect, it } from 'vitest'
import { verifyPassiveHumanSignals } from '../../api/_lib/security.js'

describe('verifyPassiveHumanSignals', () => {
  it('accepts a valid passive fallback payload', () => {
    expect(verifyPassiveHumanSignals({
      website: '',
      formRuntimeMs: 9000,
      turnstileBypassReason: 'widget_load_error',
    })).toEqual({ success: true })
  })

  it('rejects filled honeypots and implausible runtimes', () => {
    expect(verifyPassiveHumanSignals({
      website: 'spam',
      formRuntimeMs: 9000,
      turnstileBypassReason: 'widget_load_error',
    }).success).toBe(false)

    expect(verifyPassiveHumanSignals({
      website: '',
      formRuntimeMs: 300,
      turnstileBypassReason: 'widget_load_error',
    }).success).toBe(false)
  })

  it('requires an allowed fallback reason', () => {
    expect(verifyPassiveHumanSignals({
      website: '',
      formRuntimeMs: 9000,
      turnstileBypassReason: 'manual_bypass',
    }).success).toBe(false)
  })
})
