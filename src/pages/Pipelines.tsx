// src/pages/Pipelines.tsx
import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

interface Action {
  id: string;
  type: string;
  user?: string;
  channel?: string;
  destination?: string;
}

const Pipelines = () => {
  const [actions, setActions] = useState<Action[]>([
    { 
      id: '1', 
      type: 'Notification Slack', 
      user: '@itguy', 
      channel: '@itguy' 
    },
    { 
      id: '2', 
      type: 'Jail', 
      destination: 'Jail1'
    },
    { 
      id: '3', 
      type: 'Jail', 
      destination: ''
    }
  ]);

  const [searchType, setSearchType] = useState('Notification Slack');
  const [searchUser, setSearchUser] = useState('');

  // Mock data para eventos recientes
  const lastEvents = [
    { ip: '69.41.3.206', region: 'USA', time: '05:31:00 pm' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:59 pm' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:57 pm' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:56 pm' },
  ];

  const handleAddAction = () => {
    const newAction: Action = {
      id: (actions.length + 1).toString(),
      type: 'Jail',
      destination: ''
    };
    setActions([...actions, newAction]);
  };

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">PipeLines 1</h1>
          <div className="text-sm text-gray-500">Actions</div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Actions */}
          <div className="lg:col-span-2">
            {actions.map((action, index) => (
              <div key={action.id} className="mb-6">
                {/* Action header */}
                <div className="flex justify-between items-center mb-2">
                  {/* Dropdown for action type */}
                  <div className="relative w-full max-w-xs">
                    <div className="flex items-center border rounded">
                      {action.type === 'Notification Slack' && (
                        <div className="px-2">
                          <span className="flex w-6 h-6 items-center justify-center">
                            <img src="slack-icon-placeholder.svg" alt="Slack" className="w-5 h-5" />
                          </span>
                        </div>
                      )}
                      {action.type === 'Jail' && (
                        <div className="px-2">
                          <span className="flex w-6 h-6 items-center justify-center">
                            <span className="text-lg">🔒</span>
                          </span>
                        </div>
                      )}
                      <select 
                        className="appearance-none bg-transparent py-2 pl-2 pr-8 w-full"
                        value={action.type}
                        onChange={(e) => {
                          const updatedActions = [...actions];
                          updatedActions[index].type = e.target.value;
                          setActions(updatedActions);
                        }}
                      >
                        <option value="Notification Slack">Notification Slack</option>
                        <option value="Jail">Jail</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button 
                    className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => handleRemoveAction(action.id)}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* Action details based on type */}
                {action.type === 'Notification Slack' && (
                  <div className="mb-4">
                    <div className="mb-2">
                      <div className="text-sm font-medium mb-1">User / Channel</div>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded p-2 text-sm" 
                        value={action.user || ''} 
                        onChange={(e) => {
                          const updatedActions = [...actions];
                          updatedActions[index].user = e.target.value;
                          updatedActions[index].channel = e.target.value;
                          setActions(updatedActions);
                        }}
                        placeholder="@username or #channel"
                      />
                    </div>
                  </div>
                )}

                {action.type === 'Jail' && (
                  <div className="mb-4">
                    <div className="mb-2">
                      <div className="text-sm font-medium mb-1">Destination</div>
                      <div className="relative w-full">
                        <div className="flex items-center border rounded">
                          <div className="px-2">
                            <span className="flex w-6 h-6 items-center justify-center">
                              <span className="text-lg">🔒</span>
                            </span>
                          </div>
                          <select 
                            className="appearance-none bg-transparent py-2 pl-2 pr-8 w-full"
                            value={action.destination || ''}
                            onChange={(e) => {
                              const updatedActions = [...actions];
                              updatedActions[index].destination = e.target.value;
                              setActions(updatedActions);
                            }}
                          >
                            <option value="Jail1">Jail1</option>
                            <option value="Jail2">Jail2</option>
                            <option value="">Select destination...</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add button for new destination/input */}
                {index === actions.length - 1 && (
                  <div className="mt-2">
                    <button 
                      className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                      onClick={handleAddAction}
                    >
                      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1">
                <button className="p-1 rounded bg-blue-500 text-white">
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <span className="text-sm">1 de 1</span>
                <button className="p-1 rounded bg-blue-500 text-white">
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Search and Recent Events */}
          <div className="lg:col-span-1">
            {/* Search Box */}
            <div className="bg-white p-4 rounded shadow mb-4">
              <h2 className="font-bold text-lg mb-4">Search an action</h2>
              
              {/* Type Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="relative">
                  <div className="flex items-center border rounded">
                    <div className="px-2">
                      <span className="flex w-6 h-6 items-center justify-center">
                        <img src="slack-icon-placeholder.svg" alt="Slack" className="w-5 h-5" />
                      </span>
                    </div>
                    <select 
                      className="appearance-none bg-transparent py-2 pl-2 pr-8 w-full"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="Notification Slack">Notification Slack</option>
                      <option value="Jail">Jail</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">User</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-2 pl-8 text-sm" 
                    placeholder="Write the name of the user" 
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of actions */}
            <div className="bg-blue-500 text-white p-4 rounded shadow mb-4">
              <h2 className="font-bold text-lg mb-2">Types of actions</h2>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">On your panel</h3>
                <div className="bg-white text-black p-2 rounded flex items-center">
                  <div className="mr-2">
                    <img src="slack-icon-placeholder.svg" alt="Slack" className="w-5 h-5" />
                  </div>
                  <span>Notification Slack</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Vinculate an action</h3>
                <button className="w-full bg-blue-400 text-white p-2 rounded flex items-center justify-center">
                  Add new type of action
                </button>
              </div>
            </div>

            {/* Last Events */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-bold text-lg mb-4">Last Events</h2>
              
              <div className="space-y-4">
                {lastEvents.map((event, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      🇺🇸
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.ip}</div>
                      <div className="text-xs text-gray-500">{event.region}</div>
                    </div>
                    <div className="text-xs text-gray-500">{event.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pipelines;