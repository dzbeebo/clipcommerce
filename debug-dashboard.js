// Debug script to test dashboard API
const testDashboard = async () => {
  try {
    console.log('Testing dashboard API...')
    
    // Test session first
    const sessionResponse = await fetch('/api/auth/session')
    const sessionData = await sessionResponse.json()
    console.log('Session response:', sessionData)
    
    if (!sessionData.user) {
      console.log('❌ User not authenticated')
      return
    }
    
    console.log('✅ User authenticated:', sessionData.user)
    
    // Test creator profile
    const profileResponse = await fetch('/api/creator/profile')
    const profileData = await profileResponse.json()
    console.log('Profile response:', profileData)
    
    // Test dashboard
    const dashboardResponse = await fetch('/api/dashboard/creator')
    const dashboardData = await dashboardResponse.json()
    console.log('Dashboard response:', dashboardData)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testDashboard()
