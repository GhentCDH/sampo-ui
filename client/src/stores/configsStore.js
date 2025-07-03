import { create } from 'zustand'
import { configHelpers } from './helpers'
import axios from 'axios'

const apiUrl = process.env.API_URL
const CONFIGS_URL = `${apiUrl}/configs`

// const requestConfig = async (file) => {
//   const res = await axios.get(`${CONFIGS_URL}/${file}`).then(res => res.data)
//   return res
// }

export const useConfigsStore = create((set, get) => ({
  portalConfig: null,
  perspectiveConfigs: [],
  perspectiveConfigsInfoOnlyPages: [],
  jsonConfigs: {},
  imgConfigs: {},

  initConfigs: async () => {
    if (!get().portalConfig && get().perspectiveConfigs.length === 0 && get().perspectiveConfigsInfoOnlyPages.length === 0) {
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
    }
  },

  getPortalConfig: async () => {
    if (get().portalConfig !== null) {
      return get().portalConfig
    } else {
      const portal = await fetch(`${CONFIGS_URL}/portalConfig.json`).then(res => res.json())
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
      const jsonFile = await fetch(`${CONFIGS_URL}/${get().portalConfig.portalID}/${file}`).then(res => res.json())
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
      const img = await fetch(`${CONFIGS_URL}/${get().portalConfig.portalID}/assets/img/${file}`).then(res => res.url)
      set(async state => ({
        imgConfigs: { ...state.imgConfigs, [file]: img }
      }))
      return img
    }
  }
}))
