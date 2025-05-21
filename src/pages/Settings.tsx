// src/pages/Settings.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';

// Settings sections
type SettingsSection = 'profile' | 'security' | 'preferences' | 'notifications';

const Settings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || 'Security Analyst');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences state
  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  const [timezone, setTimezone] = useState(user?.preferences?.timezone || 'UTC');
  const [dateFormat, setDateFormat] = useState(user?.preferences?.dateFormat || 'MM/DD/YYYY');
  
  // Notification preferences state
  const [emailNotifications, setEmailNotifications] = useState(user?.notifications?.email !== false);
  const [pushNotifications, setPushNotifications] = useState(user?.notifications?.push !== false);
  const [alertNotifications, setAlertNotifications] = useState(user?.notifications?.alerts !== false);
  const [weeklyReports, setWeeklyReports] = useState(user?.notifications?.weeklyReports !== false);
  const [systemUpdates, setSystemUpdates] = useState(user?.notifications?.systemUpdates || false);

  
  
  const handleSaveProfile = () => {
    // Aquí enviarías los cambios del perfil a tu API
    console.log('Saving profile:', { name, email, phone, jobTitle });
    alert('Profile updated successfully');
  };
  
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Aquí enviarías la solicitud de cambio de contraseña a tu API
    console.log('Changing password');
    alert('Password changed successfully');
    
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleSavePreferences = () => {
    // Aquí guardarías las preferencias en tu API
    console.log('Saving preferences:', { language, timezone, dateFormat });
    alert('Preferences saved successfully');
  };
  
  const handleSaveNotifications = () => {
    // Aquí guardarías la configuración de notificaciones en tu API
    console.log('Saving notifications:', {
      email: emailNotifications,
      push: pushNotifications,
      alerts: alertNotifications,
      weeklyReports: weeklyReports,
      systemUpdates: systemUpdates
    });
    alert('Notification settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-medium">{name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{email || 'user@example.com'}</p>
                </div>
              </div>
              
              <h2 className="text-lg font-medium mb-4">Settings</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'profile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('profile')}
                    >
                      Profile Information
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'security' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('security')}
                    >
                      Security & Password
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'preferences' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('preferences')}
                    >
                      Preferences
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'notifications' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('notifications')}
                    >
                      Notification Settings
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Settings */}
              {activeSection === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <p className="text-gray-600 mb-6">Update your personal information and public profile.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input rounded-md w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input rounded-md w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (optional)
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input rounded-md w-full"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        id="jobTitle"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="form-input rounded-md w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {name ? name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <button className="btn btn-outline">
                          Upload New Image
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <button onClick={handleSaveProfile} className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Security & Password</h2>
                  <p className="text-gray-600 mb-6">Update your password and manage your account security settings.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-input rounded-md w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input rounded-md w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input rounded-md w-full"
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Password Requirements</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          At least 8 characters
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Mixture of uppercase and lowercase letters
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Include at least one number
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Include at least one special character
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <button 
                        onClick={handleChangePassword} 
                        className="btn btn-primary"
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                      >
                        Change Password
                      </button>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                      </p>
                      
                      <button className="btn btn-outline">
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                  <p className="text-gray-600 mb-6">Customize your experience with BlueAgent.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Language</h3>
                      <p className="text-sm text-gray-600 mb-2">Select your preferred language for the interface</p>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="form-input rounded-md w-full"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="pt">Português</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-2">Time Zone</h3>
                      <p className="text-sm text-gray-600 mb-2">Choose your local time zone</p>
                      <select 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="form-input rounded-md w-full"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="CST">CST (Central Standard Time)</option>
                        <option value="MST">MST (Mountain Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                        <option value="CET">CET (Central European Time)</option>
                        <option value="JST">JST (Japan Standard Time)</option>
                      </select>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-2">Date Format</h3>
                      <p className="text-sm text-gray-600 mb-2">Select how dates should be displayed</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="dateFormat1" 
                            name="dateFormat"
                            checked={dateFormat === 'MM/DD/YYYY'}
                            onChange={() => setDateFormat('MM/DD/YYYY')}
                            className="h-4 w-4 text-blue-600" 
                          />
                          <label htmlFor="dateFormat1" className="ml-2 block text-sm text-gray-700">
                            MM/DD/YYYY (e.g., 11/05/2024)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="dateFormat2" 
                            name="dateFormat"
                            checked={dateFormat === 'DD/MM/YYYY'}
                            onChange={() => setDateFormat('DD/MM/YYYY')}
                            className="h-4 w-4 text-blue-600" 
                          />
                          <label htmlFor="dateFormat2" className="ml-2 block text-sm text-gray-700">
                            DD/MM/YYYY (e.g., 05/11/2024)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="dateFormat3" 
                            name="dateFormat"
                            checked={dateFormat === 'YYYY-MM-DD'}
                            onChange={() => setDateFormat('YYYY-MM-DD')}
                            className="h-4 w-4 text-blue-600" 
                          />
                          <label htmlFor="dateFormat3" className="ml-2 block text-sm text-gray-700">
                            YYYY-MM-DD (e.g., 2024-11-05)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <button onClick={handleSavePreferences} className="btn btn-primary">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  <p className="text-gray-600 mb-6">Manage how and when you receive notifications.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Communication Channels</h3>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => setEmailNotifications(!emailNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${emailNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-gray-600">Receive browser push notifications</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => setPushNotifications(!pushNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${pushNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-3">Notification Types</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Security Alerts</h4>
                            <p className="text-sm text-gray-600">Critical security notifications</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              onClick={() => setAlertNotifications(!alertNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${alertNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                              <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${alertNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                              />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Weekly Report</h4>
                            <p className="text-sm text-gray-600">Weekly security summary report</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              onClick={() => setWeeklyReports(!weeklyReports)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${weeklyReports ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                              <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${weeklyReports ? 'translate-x-6' : 'translate-x-1'}`} 
                              />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">System Updates</h4>
                            <p className="text-sm text-gray-600">Information about system changes</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              onClick={() => setSystemUpdates(!systemUpdates)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${systemUpdates ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                              <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${systemUpdates ? 'translate-x-6' : 'translate-x-1'}`} 
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <button onClick={handleSaveNotifications} className="btn btn-primary">
                        Save Notification Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;