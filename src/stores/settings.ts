import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    host: localStorage.getItem('host') || '127.0.0.1',
    port: localStorage.getItem('port') || '5000',
  }),
  actions: {
    setServer(host: string, port: number) {
      this.host = host
      localStorage.setItem('host', host)
      this.port = port.toString()
      localStorage.setItem('port', port.toString())
    },
  },
})