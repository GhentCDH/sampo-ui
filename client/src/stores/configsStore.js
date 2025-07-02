import { create } from 'zustand'

export const useConfigsStore = create((set, get) => ({
  portalConfig: null,
  jsonConfigs: {},
  imgConfigs: {},

  getPortalConfig: async () => {
    if (get().portalConfig !== null) {
      return get().portalConfig
    } else {
      set({portalConfig: await fetch('/configs/portalConfig.json').then(res => res.json())})
    }
  },

  getConfigJsonFile: async (file) => {
    if (!get().portalConfig) {
      await get().getPortalConfig()
    }
    if (file in get().jsonConfigs) {
      return get().jsonConfigs[file]
    } else {
      set(async state => ({
        jsonConfigs: { ...state.jsonConfigs,  [file]: await fetch(`/configs/${get().portalConfig.portalID}/${file}`).then(res => res.json()) }
      }))
    }
  },

  getConfigImgFile: async (file) => {
    if (!get().portalConfig) {
      await get().getPortalConfig()
    }
    if (file in get().imgConfigs) {
      return get().imgConfigs[file]
    } else {
      set(async state => ({
        imgConfigs: { ...state.imgConfigs,  [file]: await fetch(`/configs/${get().portalConfig.portalID}/assets/img/${file}`).then(res => res.url) }
      }))
    }
  }
}))
