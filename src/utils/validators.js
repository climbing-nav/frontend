// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

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

// Validate login form
export const validateLoginForm = (data) => {
  const errors = {}

  if (!isRequired(data.email)) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!isValidEmail(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
  }

  if (!isRequired(data.password)) {
    errors.password = '비밀번호를 입력해주세요.'
  }

  return errors
}
