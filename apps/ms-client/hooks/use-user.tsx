import { User } from '@/types'
import { useCallback, useSyncExternalStore } from 'react'

type NoobFunction = () => void

class UserStore {
  private readonly subscribers = new Set<NoobFunction>()
  private user: User | null = null

  getUser() {
    return this.user
  }

  subscribe(notifier: NoobFunction) {
    this.subscribers.add(notifier)
    return () => this.unsubscribe(notifier)
  }

  unsubscribe(notifier: NoobFunction) {
    this.subscribers.delete(notifier)
  }

  async checkUser() {}

  emitChanges() {
    this.subscribers.forEach((caller) => {
      caller()
    })
  }

  getServerUser() {
    return this.user
  }
}
export const userStore = new UserStore()

export const useUser = () => {
  return {
    user: useSyncExternalStore(
      userStore.subscribe,
      userStore.getUser,
      userStore.getServerUser,
    ),
    setUser: userStore.checkUser,
  }
}
