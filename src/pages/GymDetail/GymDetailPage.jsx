import PropTypes from 'prop-types'
import GymDetail from '../../components/gym/GymDetail'

/**
 * GymDetailPage
 * Page wrapper for GymDetail component
 * Handles gym data from App state (non-router version)
 */
function GymDetailPage({ gym, onBack }) {
  return (
    <GymDetail 
      gym={gym}
      onBack={onBack}
      showHeader={true}
    />
  )
}

GymDetailPage.propTypes = {
  gym: PropTypes.object,
  onBack: PropTypes.func
}

export default GymDetailPage