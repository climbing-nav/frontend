// Phone number validation (Korean format)
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^01[016789]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone)
}

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

// Min length validation
export const minLength = (value, min) => {
  return value && value.length >= min
}

// Max length validation
export const maxLength = (value, max) => {
  return value && value.length <= max
}
