import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'
import { has } from 'lodash'
import intl from 'react-intl-universal'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export const stateToUrl = ({
  perspectiveID = null,
  facets,
  facetClass = null,
  page = null,
  pagesize = null,
  sortBy = null,
  sortDirection = null,
  resultFormat = null,
  constrainSelf = null,
  groupBy = null,
  uri = null,
  limit = null,
  optimize = null,
  fromID = null,
  toID = null,
  period = null,
  province = null,
  langTag = null
}) => {
  const params = {}
  if (perspectiveID !== null) { params.perspectiveID = perspectiveID }
  if (facetClass !== null) { params.facetClass = facetClass }
  if (page !== null) { params.page = page }
  if (pagesize !== null) { params.pagesize = parseInt(pagesize) }
  if (sortBy !== null) { params.sortBy = sortBy }
  if (sortDirection !== null) { params.sortDirection = sortDirection }
  if (resultFormat !== null) { params.resultFormat = resultFormat }
  if (constrainSelf !== null) { params.constrainSelf = constrainSelf }
  if (groupBy !== null) { params.groupBy = groupBy }
  if (uri !== null) { params.uri = uri }
  if (limit !== null) { params.limit = limit }
  if (optimize !== null) { params.optimize = optimize }
  if (fromID !== null) { params.fromID = fromID }
  if (toID !== null) { params.toID = toID }
  if (period !== null) { params.period = period }
  if (province !== null) { params.province = province }
  if (langTag !== null) { params.langTag = langTag }
  if (facets !== null) {
    const constraints = []
    for (const [key, value] of Object.entries(facets)) {
      if (has(value, 'uriFilter') && value.uriFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: Object.keys(value.uriFilter),
          ...(Object.prototype.hasOwnProperty.call(value, 'selectAlsoSubconcepts') &&
            { selectAlsoSubconcepts: value.selectAlsoSubconcepts }),
          useConjuction: Object.prototype.hasOwnProperty.call(value, 'useConjuction')
            ? value.useConjuction
            : false
        })
      } else if (has(value, 'spatialFilter') && value.spatialFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: boundsToValues(value.spatialFilter._bounds)
        })
      } else if (has(value, 'textFilter') && value.textFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.textFilter
        })
      } else if (has(value, 'timespanFilter') && value.timespanFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.timespanFilter
        })
      } else if (has(value, 'dateNoTimespanFilter') && value.dateNoTimespanFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.dateNoTimespanFilter
        })
      } else if (has(value, 'integerFilter') && value.integerFilter !== null) {
        constraints.push({
          facetID: key,
          filterType: value.filterType,
          priority: value.priority,
          values: value.integerFilter
        })
      }
    }
    if (constraints.length > 0) {
      params.constraints = constraints
    }
  }
  return params
}

export const urlToState = ({ initialState, qstr }) => {
  const params = qs.parse(qstr)
  return params
}

export const boundsToValues = bounds => {
  const latMin = bounds._southWest.lat
  const longMin = bounds._southWest.lng
  const latMax = bounds._northEast.lat
  const longMax = bounds._northEast.lng
  return {
    latMin,
    longMin,
    latMax,
    longMax
  }
}

export const handleAxiosError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data)
    // console.log(error.response.status);
    // console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
  console.log(error.config)
}

export const pickSelectedDatasets = datasets => {
  const selected = []
  Object.keys(datasets).forEach(key => {
    if (datasets[key].selected) {
      selected.push(key)
    }
  })
  return selected
}

export const updateLocaleToPathname = ({ pathname, locale, replaceOld }) => {
  const numberOfSlashes = pathname.split('/').length - 1
  let newPathname
  if (replaceOld) {
    const pathnameLangRemoved = numberOfSlashes === 1 ? '' : pathname.substring(pathname.indexOf('/', 1))
    newPathname = `/${locale}${pathnameLangRemoved}` // TODO: handle rootUrl from generalConfig
  } else {
    newPathname = `/${locale}${pathname}`
  }
  return newPathname
}

export const objectToQueryParams = data => {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&')
}

export const arrayToObject = ({ array, keyField }) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})

export const generateLabelForMissingValue = ({ perspective, property }) => {
  // Check if there is a translated label for missing value, or use defaults
  return intl.get(`perspectives.${perspective}.properties.${property}.missingValueLabel`) ||
    intl.get('facetBar.defaultMissingValueLabel') || 'Unknown'
}

export const getLocalIDFromAppLocation = ({ location, perspectiveConfig }) => {
  const locationArr = location.pathname.split('/')
  let localID = locationArr.pop()
  const defaultTab = perspectiveConfig.defaultTab || 'table'
  const defaultInstancePageTab = perspectiveConfig.defaultInstancePageTab || 'table'
  if (localID === defaultTab || localID === defaultInstancePageTab) {
    localID = locationArr.pop() // pop again if tab id
  }
  perspectiveConfig.instancePageTabs.forEach(tab => {
    if (localID === tab.id) {
      localID = locationArr.pop() // pop again if tab id
    }
  })
  return localID
}

export const createURIfromLocalID = ({ localID, baseURI, URITemplate, localIDAsURI }) => {
  let uri = ''
  if (localIDAsURI) {
    uri = decodeURIComponent(localID)
  } else {
    uri = URITemplate
    uri = uri.replaceAll('<BASE_URI>', baseURI)
    uri = uri.replaceAll('<LOCAL_ID>', localID)
  }
  return uri
}

export const getSpacing = (theme, value) => Number(theme.spacing(value).slice(0, -2))

export const getScreenSize = () => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const smScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const mdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const lgScreen = useMediaQuery(theme.breakpoints.between('lg', 'xl'))
  const xlScreen = useMediaQuery(theme.breakpoints.up('xl'))
  let screenSize = ''
  if (xsScreen) { screenSize = 'xs' }
  if (smScreen) { screenSize = 'sm' }
  if (mdScreen) { screenSize = 'md' }
  if (lgScreen) { screenSize = 'lg' }
  if (xlScreen) { screenSize = 'xl' }
  return screenSize
}

// https://v5.reactrouter.com/web/api/Hooks/uselocation
export const usePageViews = () => {
  const location = useLocation()
  useEffect(() => {
    if (typeof window.ga === 'function') {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#tracking_virtual_pageviews
      // note: the ga function has been initialized in index.html
      window.ga('set', 'page', location.pathname)
      window.ga('send', 'pageview')
    }
  }, [location])
}
