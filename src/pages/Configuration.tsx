// src/pages/Configuration.tsx
import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

// Configuration sections
type ConfigSection = 'general' | 'security' | 'notifications' | 'integration';

const Configuration = () => {
  const [activeSection, setActiveSection] = useState<ConfigSection>('general');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [logLevel, setLogLevel] = useState('info');
  const [maxRetention, setMaxRetention] = useState('30');
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhooks/blueagent');
  
  // Integration settings
  const [slackIntegration, setSlackIntegration] = useState(true);
  const [emailIntegration, setEmailIntegration] = useState(true);
  const [smsIntegration, setSmsIntegration] = useState(false);
  
  const handleSaveChanges = () => {
    // Here you would save the changes to your API
    alert('Configuration settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">System Configuration</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Configuration Sections</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'general' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('general')}
                    >
                      General Settings
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'security' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('security')}
                    >
                      Security & Compliance
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
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeSection === 'integration' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSection('integration')}
                    >
                      API & Integrations
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {/* General Settings */}
              {activeSection === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">User Interface Mode</h3>
                        <p className="text-sm text-gray-600">Choose between light and dark theme</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'font-medium'}`}>Light</span>
                        <button 
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span 
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} 
                          />
                        </button>
                        <span className={`ml-2 ${darkMode ? 'font-medium' : 'text-gray-400'}`}>Dark</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Automatic Updates</h3>
                        <p className="text-sm text-gray-600">Enable automatic updates for the system</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${autoUpdateEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span 
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${autoUpdateEnabled ? 'translate-x-6' : 'translate-x-1'}`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-2">Logging Level</h3>
                      <p className="text-sm text-gray-600 mb-2">Set the verbosity of system logs</p>
                      <select 
                        value={logLevel}
                        onChange={(e) => setLogLevel(e.target.value)}
                        className="form-input rounded-md w-full"
                      >
                        <option value="error">Error (Only critical issues)</option>
                        <option value="warn">Warning (Issues and warnings)</option>
                        <option value="info">Info (Standard information)</option>
                        <option value="debug">Debug (Detailed for troubleshooting)</option>
                        <option value="trace">Trace (Maximum verbosity)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Security & Compliance</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-medium mb-2">Data Retention</h3>
                      <p className="text-sm text-gray-600 mb-2">Configure how long event data is stored</p>
                      <div className="flex space-x-2 items-center">
                        <input 
                          type="number"
                          value={maxRetention}
                          onChange={(e) => setMaxRetention(e.target.value)}
                          className="form-input rounded-md w-24"
                          min="1"
                          max="365"
                        />
                        <span>days</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Event data older than this will be automatically deleted</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mb-2">Require 2FA for all admin users</p>
                      <div className="flex items-center space-x-2 mb-4">
                        <input type="checkbox" id="require2fa" className="h-4 w-4 rounded" />
                        <label htmlFor="require2fa">Enforce 2FA for administrative actions</label>
                      </div>
                      
                      <h3 className="font-medium mb-2">Password Policy</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="minLength" className="h-4 w-4 rounded" checked />
                          <label htmlFor="minLength">Minimum 8 characters</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="requireUpper" className="h-4 w-4 rounded" checked />
                          <label htmlFor="requireUpper">Require uppercase letters</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="requireSpecial" className="h-4 w-4 rounded" checked />
                          <label htmlFor="requireSpecial">Require special characters</label>
                        </div>
                      </div>
                      
                      <h3 className="font-medium mb-2">IP Allowlist</h3>
                      <p className="text-sm text-gray-600 mb-2">Restrict access to specific IP addresses</p>
                      <textarea 
                        className="form-input rounded-md w-full h-24"
                        placeholder="Enter IP addresses, one per line"
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">Leave blank to allow all IPs</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Enable Notifications</h3>
                        <p className="text-sm text-gray-600">Master switch for all system notifications</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span 
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-3">Alert Thresholds</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Critical Alert Threshold
                          </label>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="range" 
                              min="1" 
                              max="100" 
                              defaultValue="85" 
                              className="w-full" 
                            />
                            <span className="text-sm">85%</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Warning Alert Threshold
                          </label>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="range" 
                              min="1" 
                              max="100" 
                              defaultValue="60" 
                              className="w-full" 
                            />
                            <span className="text-sm">60%</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alert Grouping Interval
                          </label>
                          <select className="form-input rounded-md w-full">
                            <option>1 minute</option>
                            <option>5 minutes</option>
                            <option selected>15 minutes</option>
                            <option>30 minutes</option>
                            <option>1 hour</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-3">Notification Recipients</h3>
                      <div className="space-y-2">
                        <input 
                          type="email" 
                          placeholder="Enter email address" 
                          className="form-input rounded-md w-full" 
                          defaultValue="admin@example.com"
                        />
                        <div className="flex">
                          <button className="btn btn-outline text-sm">
                            + Add Recipient
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* API & Integrations */}
              {activeSection === 'integration' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">API & Integrations</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-medium mb-2">API Settings</h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="flex">
                          <input 
                            type="text" 
                            value={apiKey} 
                            className="form-input rounded-l-md flex-grow" 
                            readOnly
                          />
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md">
                            Regenerate
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Webhook URL
                        </label>
                        <input 
                          type="url" 
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="form-input rounded-md w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate Limit (requests per minute)
                        </label>
                        <input 
                          type="number" 
                          defaultValue="60" 
                          min="1"
                          className="form-input rounded-md w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">External Integrations</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#4A154B] rounded-md flex items-center justify-center mr-3">
                              <span className="text-white font-bold">S</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Slack</h4>
                              <p className="text-sm text-gray-600">Send notifications to Slack</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSlackIntegration(!slackIntegration)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${slackIntegration ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${slackIntegration ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#D44638] rounded-md flex items-center justify-center mr-3">
                              <span className="text-white font-bold">E</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Email</h4>
                              <p className="text-sm text-gray-600">Send email notifications</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setEmailIntegration(!emailIntegration)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${emailIntegration ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${emailIntegration ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#37B24D] rounded-md flex items-center justify-center mr-3">
                              <span className="text-white font-bold">SMS</span>
                            </div>
                            <div>
                              <h4 className="font-medium">SMS</h4>
                              <p className="text-sm text-gray-600">Send text message alerts</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSmsIntegration(!smsIntegration)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${smsIntegration ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${smsIntegration ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                        
                        <button className="btn btn-outline text-sm">
                          + Connect New Integration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Save button */}
              <div className="mt-8 flex justify-end">
                <button onClick={handleSaveChanges} className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuration;