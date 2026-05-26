const createWebStorage = (type) => {
  const storage = window[type]

  return {
    getItem: (key) => Promise.resolve(storage.getItem(key)),
    setItem: (key, value) => Promise.resolve(storage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(storage.removeItem(key)),
  }
}

const storage = typeof window !== 'undefined' ? createWebStorage('localStorage') : {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
}

export default storage