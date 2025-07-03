import { create } from 'zustand'
import { configHelpers } from './helpers'

export const useConfigsStore = create((set, get) => ({
  portalConfig: null,
  perspectiveConfigs: [],
  perspectiveConfigsInfoOnlyPages: [],
  jsonConfigs: {},
  imgConfigs: {},

  initConfigs: async () => {
    const helpers = configHelpers(get().getConfigJsonFile, get().getConfigImgFile)
    const portalConfig = await get().getPortalConfig()
    await helpers.processPortalConfig(portalConfig)
    const perspectiveConfigs = await helpers.createPerspectiveConfigs(portalConfig.perspectives.searchPerspectives)
    set({
      perspectiveConfigs
    })
    const perspectiveConfigsInfoOnlyPages = await helpers.createPerspectiveConfigOnlyInfoPages(portalConfig.perspectives.onlyInstancePages)
    set({
      perspectiveConfigsInfoOnlyPages
    })
  },

  getPortalConfig: async () => {
    if (get().portalConfig !== null) {
      return get().portalConfig
    } else {
      const portal = await fetch('/configs/portalConfig.json').then(res => res.json())
      set({ portalConfig: portal })
      return portal
    }
  },

  getConfigJsonFile: async (file) => {
    if (!get().portalConfig) {
      await get().getPortalConfig()
    }
    if (file in get().jsonConfigs) {
      return get().jsonConfigs[file]
    } else {
      const jsonFile = await fetch(`/configs/${get().portalConfig.portalID}/${file}`).then(res => res.json())
      set(async state => ({
        jsonConfigs: { ...state.jsonConfigs, [file]: jsonFile }
      }))
      return jsonFile
    }
  },

  getConfigImgFile: async (file) => {
    if (!get().portalConfig) {
      await get().getPortalConfig()
    }
    if (file in get().imgConfigs) {
      return get().imgConfigs[file]
    } else {
      const img = await fetch(`/configs/${get().portalConfig.portalID}/assets/img/${file}`).then(res => res.url)
      set(async state => ({
        imgConfigs: { ...state.imgConfigs, [file]: img }
      }))
      return img
    }
  }
}))
