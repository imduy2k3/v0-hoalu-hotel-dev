// Test auth context
console.log('🔍 Testing Auth Context...')

// Check localStorage
const token = localStorage.getItem("admin_token")
const userData = localStorage.getItem("admin_user")

console.log('Token:', token)
console.log('UserData:', userData)

if (userData) {
  try {
    const user = JSON.parse(userData)
    console.log('Parsed User:', user)
    console.log('User Name:', user.fullName)
    console.log('User Email:', user.email)
    console.log('User Role:', user.role)
  } catch (error) {
    console.error('Parse Error:', error)
  }
} else {
  console.log('No user data found in localStorage')
}

// Test login
console.log('\n🔍 Testing Login...')
const testEmail = 'admin@hoalucity.com'
const testPassword = 'admin123'

console.log('Testing login with:', testEmail, testPassword)
