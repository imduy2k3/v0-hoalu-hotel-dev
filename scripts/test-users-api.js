// Test users API
console.log('🔍 Testing Users API...')

// Test GET /api/users
async function testGetUsers() {
  try {
    console.log('\n📡 Testing GET /api/users...')
    const response = await fetch('/api/users')
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', data)
  } catch (error) {
    console.error('Error testing GET /api/users:', error)
  }
}

// Test PUT /api/users/1
async function testUpdateUser() {
  try {
    console.log('\n📡 Testing PUT /api/users/1...')
    const updateData = {
      username: 'admin',
      email: 'admin@hoalucity.com',
      fullName: 'Quản trị viên Updated',
      role: 'admin',
      password: 'newpassword123',
      isActive: true
    }
    
    const response = await fetch('/api/users/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', data)
  } catch (error) {
    console.error('Error testing PUT /api/users/1:', error)
  }
}

// Run tests
testGetUsers()
testUpdateUser()
