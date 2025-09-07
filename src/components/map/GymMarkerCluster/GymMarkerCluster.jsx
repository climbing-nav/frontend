import { useMemo, useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import GymMarker from '../GymMarker'

/**
 * GymMarkerCluster Component
 * Manages gym marker clustering based on zoom level and proximity
 * 
 * @param {Object} props
 * @param {Array} props.gyms - Array of gym data
 * @param {Object} props.map - Kakao Map instance
 * @param {number} props.maxZoom - Maximum zoom level for clustering (default: 10)
 * @param {number} props.gridSize - Grid size for clustering algorithm (default: 100)
 * @param {Function} props.onMarkerClick - Marker click handler
 * @param {Function} props.onClusterClick - Cluster click handler
 */
function GymMarkerCluster({
  gyms = [],
  map,
  maxZoom = 10,
  gridSize = 100,
  onMarkerClick = null,
  onClusterClick = null
}) {
  const markersRef = useRef([])
  const clustersRef = useRef([])

  // Validate required props
  if (!map || !window.kakao || !window.kakao.maps || !Array.isArray(gyms)) {
    return null
  }

  // Calculate distance between two points in pixels
  const getPixelDistance = useCallback((point1, point2) => {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Convert lat/lng to screen pixels
  const latLngToPixel = useCallback((lat, lng) => {
    if (!map || !window.kakao) return null
    
    const projection = map.getProjection()
    const coord = new window.kakao.maps.LatLng(lat, lng)
    return projection.pointFromCoord(coord)
  }, [map])

  // Convert screen pixels to lat/lng
  const pixelToLatLng = useCallback((x, y) => {
    if (!map || !window.kakao) return null
    
    const projection = map.getProjection()
    const point = new window.kakao.maps.Point(x, y)
    return projection.coordFromPoint(point)
  }, [map])

  // Simple clustering algorithm based on grid
  const clusterGyms = useCallback((gymList, currentZoom) => {
    if (!map || gymList.length === 0) return { clusters: [], singleMarkers: [] }

    // Don't cluster at high zoom levels
    if (currentZoom > maxZoom) {
      return {
        clusters: [],
        singleMarkers: gymList.map(gym => ({
          ...gym,
          isCluster: false
        }))
      }
    }

    const clusters = []
    const processed = new Set()
    const singleMarkers = []

    for (let i = 0; i < gymList.length; i++) {
      if (processed.has(i)) continue

      const baseGym = gymList[i]
      const basePoint = latLngToPixel(baseGym.lat, baseGym.lng)
      
      if (!basePoint) continue

      const clusterGroup = [baseGym]
      const clusterIndices = [i]

      // Find nearby gyms within grid size
      for (let j = i + 1; j < gymList.length; j++) {
        if (processed.has(j)) continue

        const compareGym = gymList[j]
        const comparePoint = latLngToPixel(compareGym.lat, compareGym.lng)

        if (!comparePoint) continue

        const distance = getPixelDistance(basePoint, comparePoint)
        
        if (distance <= gridSize) {
          clusterGroup.push(compareGym)
          clusterIndices.push(j)
        }
      }

      // Mark all gyms in this group as processed
      clusterIndices.forEach(index => processed.add(index))

      if (clusterGroup.length > 1) {
        // Create cluster
        const centerLat = clusterGroup.reduce((sum, gym) => sum + gym.lat, 0) / clusterGroup.length
        const centerLng = clusterGroup.reduce((sum, gym) => sum + gym.lng, 0) / clusterGroup.length

        // Determine cluster congestion (most common or worst case)
        const congestionCounts = clusterGroup.reduce((counts, gym) => {
          counts[gym.congestion] = (counts[gym.congestion] || 0) + 1
          return counts
        }, {})

        const clusterCongestion = Object.entries(congestionCounts)
          .sort((a, b) => {
            // Priority: crowded > normal > comfortable
            const order = { crowded: 3, normal: 2, comfortable: 1 }
            return (order[b[0]] || 0) - (order[a[0]] || 0)
          })[0]?.[0] || 'comfortable'

        clusters.push({
          id: `cluster-${centerLat}-${centerLng}`,
          lat: centerLat,
          lng: centerLng,
          count: clusterGroup.length,
          gyms: clusterGroup,
          congestion: clusterCongestion,
          isCluster: true
        })
      } else {
        // Single marker
        singleMarkers.push({
          ...clusterGroup[0],
          isCluster: false
        })
      }
    }

    return { clusters, singleMarkers }
  }, [map, maxZoom, gridSize, latLngToPixel, getPixelDistance])

  // Get current zoom level
  const getCurrentZoom = useCallback(() => {
    return map ? map.getLevel() : 3
  }, [map])

  // Create cluster marker
  const createClusterMarker = useCallback((cluster) => {
    if (!map || !window.kakao || !window.kakao.maps) return null

    const position = new window.kakao.maps.LatLng(cluster.lat, cluster.lng)
    
    // Create cluster SVG with count
    const clusterSvg = `
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="clusterGradient" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </radialGradient>
          <filter id="clusterShadow" x="-20%" y="-20%" width="140%" height="140%">
            <dropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Outer ring -->
        <circle cx="30" cy="30" r="25" fill="url(#clusterGradient)" 
                stroke="white" stroke-width="3" filter="url(#clusterShadow)"/>
        
        <!-- Inner ring -->
        <circle cx="30" cy="30" r="18" fill="white" stroke="#667eea" stroke-width="2"/>
        
        <!-- Count text -->
        <text x="30" y="30" text-anchor="middle" dominant-baseline="central" 
              font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
              fill="#667eea">${cluster.count}</text>
        
        <!-- Small congestion indicator -->
        <circle cx="45" cy="15" r="6" fill="${getClusterCongestionColor(cluster.congestion)}" 
                stroke="white" stroke-width="2"/>
      </svg>
    `

    const imageSrc = 'data:image/svg+xml;base64,' + btoa(clusterSvg)
    const imageSize = new window.kakao.maps.Size(60, 60)
    const imageOption = { offset: new window.kakao.maps.Point(30, 30) }
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      title: `${cluster.count}개 체육관`,
      zIndex: 1000,
      clickable: true
    })

    // Store cluster data
    marker.clusterData = cluster

    // Add click event
    if (onClusterClick) {
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onClusterClick(cluster, marker)
      })
    } else {
      // Default behavior: zoom in to cluster
      window.kakao.maps.event.addListener(marker, 'click', () => {
        const bounds = new window.kakao.maps.LatLngBounds()
        cluster.gyms.forEach(gym => {
          bounds.extend(new window.kakao.maps.LatLng(gym.lat, gym.lng))
        })
        map.setBounds(bounds)
      })
    }

    return marker
  }, [map, onClusterClick])

  // Get cluster congestion color
  const getClusterCongestionColor = useCallback((congestion) => {
    const colorMap = {
      'comfortable': '#10b981',
      'normal': '#f59e0b',
      'crowded': '#ef4444'
    }
    return colorMap[congestion] || '#9e9e9e'
  }, [])

  // Update markers based on zoom level
  const updateMarkers = useCallback(() => {
    if (!map || !gyms.length) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null)
      }
    })
    clustersRef.current.forEach(cluster => {
      if (cluster && cluster.setMap) {
        cluster.setMap(null)
      }
    })
    markersRef.current = []
    clustersRef.current = []

    const currentZoom = getCurrentZoom()
    const { clusters, singleMarkers } = clusterGyms(gyms, currentZoom)

    // Create cluster markers
    clusters.forEach(cluster => {
      const clusterMarker = createClusterMarker(cluster)
      if (clusterMarker) {
        clusterMarker.setMap(map)
        clustersRef.current.push(clusterMarker)
      }
    })

    // Create individual gym markers
    singleMarkers.forEach(gym => {
      const gymMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(gym.lat, gym.lng),
        title: gym.name,
        clickable: true
      })

      // Store gym data
      gymMarker.gymData = gym

      // Add click event
      if (onMarkerClick) {
        window.kakao.maps.event.addListener(gymMarker, 'click', () => {
          onMarkerClick(gym, gymMarker)
        })
      }

      gymMarker.setMap(map)
      markersRef.current.push(gymMarker)
    })
  }, [map, gyms, getCurrentZoom, clusterGyms, createClusterMarker, onMarkerClick])

  // Listen for zoom changes
  useEffect(() => {
    if (!map) return

    const handleZoomChanged = () => {
      updateMarkers()
    }

    window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChanged)
    
    // Initial update
    updateMarkers()

    return () => {
      window.kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChanged)
    }
  }, [map, updateMarkers])

  // Listen for map changes that might affect clustering
  useEffect(() => {
    if (!map) return

    const handleBoundsChanged = () => {
      // Debounce updates to avoid excessive re-clustering
      const timeoutId = setTimeout(updateMarkers, 100)
      return () => clearTimeout(timeoutId)
    }

    window.kakao.maps.event.addListener(map, 'bounds_changed', handleBoundsChanged)

    return () => {
      window.kakao.maps.event.removeListener(map, 'bounds_changed', handleBoundsChanged)
    }
  }, [map, updateMarkers])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null)
        }
      })
      clustersRef.current.forEach(cluster => {
        if (cluster && cluster.setMap) {
          cluster.setMap(null)
        }
      })
      markersRef.current = []
      clustersRef.current = []
    }
  }, [])

  // This component doesn't render React elements
  // It manages Kakao Map markers programmatically
  return null
}

GymMarkerCluster.propTypes = {
  gyms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    congestion: PropTypes.string.isRequired
  })),
  map: PropTypes.object.isRequired,
  maxZoom: PropTypes.number,
  gridSize: PropTypes.number,
  onMarkerClick: PropTypes.func,
  onClusterClick: PropTypes.func
}

export default GymMarkerCluster