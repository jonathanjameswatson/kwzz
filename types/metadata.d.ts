declare module '#app' {
  interface PageMeta {
    isVisibleTo?: 'everyone' | 'signedIn' | 'signedOut'
  }
}

export {}
