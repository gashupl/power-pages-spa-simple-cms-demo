// lib/webapi.ts
interface TokenDeferredLike {
  done: (cb: (token: string) => void) => {
    fail: (cb: (error: unknown) => void) => void
  }
  fail: (cb: (error: unknown) => void) => void
}

declare global {
  interface Window {
    shell?: {
      getTokenDeferred: () => TokenDeferredLike
    }
  }
}

export interface SafeFetchOptions {
  url: string
  method?: string
  headers?: Record<string, string>
  signal?: AbortSignal
}

// Fetch JSON with token header
export async function safeFetch<T = unknown>({
  url,
  method = 'GET',
  headers = {},
  signal,
}: SafeFetchOptions): Promise<T> {
  const shell = window.shell
  if (!shell || typeof shell.getTokenDeferred !== 'function') {
    throw new Error('window.shell.getTokenDeferred unavailable')
  }

  const token: string = await new Promise((resolve, reject) => {
    try {
      const deferred = shell.getTokenDeferred()
      if (typeof (deferred as any).then === 'function') {
        ;(deferred as any).then(
          (t: string) => resolve(t),
          () => reject(new Error('Token acquisition failed'))
        )
      } else if (typeof deferred.done === 'function') {
        deferred
          .done((t: string) => resolve(t))
          .fail(() => reject(new Error('Token acquisition failed')))
      } else {
        reject(new Error('Unsupported token deferred type'))
      }
    } catch (e) {
      reject(e)
    }
  })

  const mergedHeaders: Record<string, string> = {
    __RequestVerificationToken: token,
    Accept: 'application/json',
    ...headers,
  }

  const resp = await fetch(url, { method, headers: mergedHeaders, signal })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`HTTP ${resp.status} ${resp.statusText} - ${text}`)
  }
  const contentType = resp.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return resp.json()
  }
  return (await resp.text()) as unknown as T
}

export const webapi = { safeFetch }
