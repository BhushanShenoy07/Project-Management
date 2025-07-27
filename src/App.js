import React, { useState, useEffect, useReducer } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle, Users,
  TrendingUp, Search, Download, Sun, Moon
} from 'lucide-react';
import * as math from 'mathjs';
import './App.css'; // <-- Add this line for external CSS

// ----- Initial State -----
const initialState = {
  projects: [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce solution',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      progress: 65,
      budget: 50000,
      spent: 32500,
      teamSize: 8,
      category: 'web'
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application',
      status: 'active',
      priority: 'critical',
      startDate: '2024-02-01',
      endDate: '2024-08-15',
      progress: 40,
      budget: 75000,
      spent: 22500,
      teamSize: 12,
      category: 'mobile'
    },
    {
      id: 3,
      name: 'AI Chatbot Integration',
      description: 'Customer service automation',
      status: 'completed',
      priority: 'medium',
      startDate: '2023-11-01',
      endDate: '2024-03-15',
      progress: 100,
      budget: 30000,
      spent: 28000,
      teamSize: 5,
      category: 'ai'
    }
  ],
  tasks: [
    {
      id: 1,
      projectId: 1,
      title: 'Database Design',
      description: 'Design and implement database schema',
      status: 'completed',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-03-01',
      estimatedHours: 40,
      actualHours: 35,
      category: 'backend'
    },
    {
      id: 2,
      projectId: 1,
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment system',
      status: 'in-progress',
      priority: 'critical',
      assignee: 'Jane Smith',
      dueDate: '2024-07-15',
      estimatedHours: 60,
      actualHours: 25,
      category: 'integration'
    },
    {
      id: 3,
      projectId: 2,
      title: 'Security Implementation',
      description: 'Implement biometric authentication',
      status: 'pending',
      priority: 'critical',
      assignee: 'Mike Johnson',
      dueDate: '2024-08-01',
      estimatedHours: 80,
      actualHours: 0,
      category: 'security'
    }
  ],
  teamMembers: [
    { id: 1, name: 'John Doe', role: 'Backend Developer', skills: ['Python', 'Django', 'PostgreSQL'], availability: 'full-time' },
    { id: 2, name: 'Jane Smith', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'CSS'], availability: 'full-time' },
    { id: 3, name: 'Mike Johnson', role: 'Security Engineer', skills: ['Cybersecurity', 'Encryption', 'Audit'], availability: 'part-time' }
  ],
  analytics: {
    productivity: [
      { month: 'Jan', completed: 12, planned: 15, efficiency: 80 },
      { month: 'Feb', completed: 18, planned: 20, efficiency: 90 },
      { month: 'Mar', completed: 22, planned: 22, efficiency: 100 },
      { month: 'Apr', completed: 25, planned: 24, efficiency: 104 },
      { month: 'May', completed: 20, planned: 26, efficiency: 77 },
      { month: 'Jun', completed: 28, planned: 30, efficiency: 93 }
    ],
    budget: [
      { project: 'E-commerce', allocated: 50000, spent: 32500, remaining: 17500 },
      { project: 'Banking App', allocated: 75000, spent: 22500, remaining: 52500 },
      { project: 'AI Chatbot', allocated: 30000, spent: 28000, remaining: 2000 }
    ]
  }
};

// ----- Reducer -----
function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        tasks: state.tasks.filter(t => t.projectId !== action.payload)
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => 
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };
    case 'ADD_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: [...state.teamMembers, { ...action.payload, id: Date.now() }]
      };
    default:
      return state;
  }
}

// ----- Styles -----
const styles = {
  container: (dark) => ({
    minHeight: '100vh',
    backgroundColor: dark ? '#181c24' : '#F9FAFB',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: dark ? '#f3f3f3' : '#23283a',
    transition: 'background 0.3s, color 0.3s'
  }),
  nav: (dark) => ({
    backgroundColor: dark ? '#23283a' : 'white',
    borderBottom: dark ? '1px solid #2d3142' : '1px solid #E5E7EB',
    padding: '0 24px'
  }),
  navTitle: (dark) => ({
    margin: 0,
    color: dark ? '#ffb347' : '#1F2937',
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  }),
  navBtn: (active, dark) => ({
    background: active ? (dark ? '#ffb347' : '#3B82F6') : 'transparent',
    color: active ? (dark ? '#23283a' : 'white') : (dark ? '#f3f3f3' : '#374151'),
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.2s, color 0.2s'
  }),
  sidebar: (dark) => ({
    background: dark ? '#23283a' : '#fff',
    borderRadius: '12px',
    boxShadow: dark ? '0 2px 8px #0008' : '0 2px 8px #0001',
    padding: '24px',
    marginBottom: '32px'
  }),
  // ...add more as needed...
};

// ----- Color Maps (move these above all render functions so they're in scope) -----
const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#7C3AED'
};

const statusColors = {
  pending: '#6B7280',
  'in-progress': '#3B82F6',
  completed: '#10B981',
  active: '#3B82F6',
  paused: '#F59E0B',
  cancelled: '#EF4444'
};

// ----- Main App -----
export default function ProjectManagementApp() {
  // ----- State -----
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(true);

  // ----- Effects -----
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const overdueTasks = state.tasks.filter(task =>
      new Date(task.dueDate) < new Date() && task.status !== 'completed'
    );
    if (overdueTasks.length > 0) {
      setNotifications(prev => [
        ...prev.filter(n => !n.message.includes('overdue')),
        {
          id: Date.now(),
          type: 'warning',
          message: `${overdueTasks.length} tasks are overdue`,
          timestamp: new Date()
        }
      ]);
    }
  }, [state.tasks]);

  // ----- Utility Functions -----
  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const actionMap = {
      'add-project': 'ADD_PROJECT',
      'edit-project': 'UPDATE_PROJECT',
      'add-task': 'ADD_TASK',
      'edit-task': 'UPDATE_TASK',
      'add-member': 'ADD_TEAM_MEMBER'
    };
    dispatch({ type: actionMap[modalType], payload: formData });
    closeModal();
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: `Successfully ${modalType.includes('add') ? 'added' : 'updated'} ${modalType.split('-')[1]}`,
      timestamp: new Date()
    }]);
  };

  // ----- Filtering -----
  const filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const filteredTasks = state.tasks.filter(task => {
    if (selectedProject && task.projectId !== selectedProject.id) return false;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ----- Stats -----
  const calculateProjectStats = () => {
    const total = state.projects.length;
    const active = state.projects.filter(p => p.status === 'active').length;
    const completed = state.projects.filter(p => p.status === 'completed').length;
    const totalBudget = state.projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = state.projects.reduce((sum, p) => sum + p.spent, 0);
    const avgProgress = math.mean(state.projects.map(p => p.progress));
    
    return { total, active, completed, totalBudget, totalSpent, avgProgress };
  };

  const calculateTaskStats = () => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.status === 'completed').length;
    const inProgress = state.tasks.filter(t => t.status === 'in-progress').length;
    const pending = state.tasks.filter(t => t.status === 'pending').length;
    const overdue = state.tasks.filter(t => 
      new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;
    
    return { total, completed, inProgress, pending, overdue };
  };

  // ----- Category List -----
  const categories = ['all', ...Array.from(new Set(state.projects.map(p => p.category)))];

  // ----- Pie Data (define inside component so it uses latest task stats) -----
  const pieData = [
    { name: 'Completed', value: calculateTaskStats().completed, color: '#10B981' },
    { name: 'In Progress', value: calculateTaskStats().inProgress, color: '#3B82F6' },
    { name: 'Pending', value: calculateTaskStats().pending, color: '#6B7280' },
    { name: 'Overdue', value: calculateTaskStats().overdue, color: '#EF4444' }
  ];

  // ----- Generate Report (move this function inside the component so it's in scope) -----
  const generateReport = () => {
    const projectStats = calculateProjectStats();
    const taskStats = calculateTaskStats();

    const report = `
PROJECT MANAGEMENT REPORT
Generated: ${currentTime.toLocaleString()}

PROJECT OVERVIEW:
- Total Projects: ${projectStats.total}
- Active Projects: ${projectStats.active}
- Completed Projects: ${projectStats.completed}
- Average Progress: ${projectStats.avgProgress.toFixed(1)}%
- Total Budget: $${projectStats.totalBudget.toLocaleString()}
- Total Spent: $${projectStats.totalSpent.toLocaleString()}
- Budget Utilization: ${((projectStats.totalSpent / projectStats.totalBudget) * 100).toFixed(1)}%

TASK OVERVIEW:
- Total Tasks: ${taskStats.total}
- Completed Tasks: ${taskStats.completed}
- In Progress: ${taskStats.inProgress}
- Pending Tasks: ${taskStats.pending}
- Overdue Tasks: ${taskStats.overdue}
- Completion Rate: ${((taskStats.completed / taskStats.total) * 100).toFixed(1)}%

TEAM OVERVIEW:
- Total Team Members: ${state.teamMembers.length}
- Full-time Members: ${state.teamMembers.filter(m => m.availability === 'full-time').length}
- Part-time Members: ${state.teamMembers.filter(m => m.availability === 'part-time').length}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-report-${Date.now()}.txt`;
    a.click();
  };

  // ----- Render Functions -----
  const renderDashboard = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard Overview</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={generateReport} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <Download size={16} />
            Export Report
          </button>
          <div style={{ padding: '8px 16px', backgroundColor: '#F3F4F6', borderRadius: '6px', fontSize: '14px' }}>
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { title: 'Total Projects', value: calculateProjectStats().total, icon: <Users />, color: '#3B82F6' },
          { title: 'Active Projects', value: calculateProjectStats().active, icon: <Clock />, color: '#10B981' },
          { title: 'Completed Tasks', value: calculateTaskStats().completed, icon: <CheckCircle />, color: '#059669' },
          { title: 'Overdue Tasks', value: calculateTaskStats().overdue, icon: <AlertCircle />, color: '#EF4444' },
          { title: 'Budget Utilization', value: `${((calculateProjectStats().totalSpent / calculateProjectStats().totalBudget) * 100).toFixed(1)}%`, icon: <TrendingUp />, color: '#F59E0B' },
          { title: 'Team Members', value: state.teamMembers.length, icon: <Users />, color: '#7C3AED' }
        ].map((stat, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>{stat.title}</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ marginTop: 0 }}>Productivity Trends</h3>
          <LineChart width={600} height={300} data={state.analytics.productivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="planned" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="efficiency" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ marginTop: 0 }}>Task Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx={150}
              cy={150}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
        <h3 style={{ marginTop: 0 }}>Budget Analysis</h3>
        <BarChart width={800} height={300} data={state.analytics.budget}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="project" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="allocated" fill="#3B82F6" />
          <Bar dataKey="spent" fill="#10B981" />
          <Bar dataKey="remaining" fill="#F59E0B" />
        </BarChart>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Projects</h2>
        <button onClick={() => openModal('add-project')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredProjects.map(project => (
          <div key={project.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#1F2937' }}>{project.name}</h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => openModal('edit-project', project)} style={{ padding: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                  <Edit size={16} />
                </button>
                <button onClick={() => dispatch({ type: 'DELETE_PROJECT', payload: project.id })} style={{ padding: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>{project.description}</p>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: '500',
                backgroundColor: statusColors[project.status] + '20',
                color: statusColors[project.status]
              }}>
                {project.status.toUpperCase()}
              </span>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: '500',
                backgroundColor: priorityColors[project.priority] + '20',
                color: priorityColors[project.priority]
              }}>
                {project.priority.toUpperCase()}
              </span>
            </div>

            <div style={{ margBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Progress</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{project.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${project.progress}%`, 
                  height: '100%', 
                  backgroundColor: project.progress === 100 ? '#10B981' : '#3B82F6',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6B7280' }}>Budget: </span>
                <span style={{ fontWeight: '500' }}>${project.budget.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Spent: </span>
                <span style={{ fontWeight: '500' }}>${project.spent.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Team: </span>
                <span style={{ fontWeight: '500' }}>{project.teamSize} members</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Due: </span>
                <span style={{ fontWeight: '500' }}>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedProject(project); setActiveTab('tasks'); }}
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                padding: '8px', 
                backgroundColor: '#F3F4F6', 
                border: '1px solid #D1D5DB', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              View Tasks ({state.tasks.filter(t => t.projectId === project.id).length})
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Tasks</h2>
          {selectedProject && (
            <p style={{ color: '#6B7280', margin: '5px 0' }}>
              Project: {selectedProject.name}
              <button onClick={() => setSelectedProject(null)} style={{ marginLeft: '10px', padding: '4px 8px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                Clear Filter
              </button>
            </p>
          )}
        </div>
        <button onClick={() => openModal('add-task')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Priority</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Due Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Progress</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const project = state.projects.find(p => p.id === task.projectId);
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
                
                return (
                  <tr key={task.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>{task.title}</div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>{task.description}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{project?.name || 'Unknown'}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{task.assignee}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: statusColors[task.status] + '20',
                        color: statusColors[task.status]
                      }}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: priorityColors[task.priority] + '20',
                        color: priorityColors[task.priority]
                      }}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        color: isOverdue ? '#EF4444' : '#374151',
                        fontWeight: isOverdue ? '500' : 'normal'
                      }}>
                        {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue && <span style={{ marginLeft: '5px', fontSize: '12px' }}>(OVERDUE)</span>}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{task.actualHours}/{task.estimatedHours}h</span>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%`, 
                            height: '100%', 
                            backgroundColor: task.actualHours > task.estimatedHours ? '#EF4444' : '#10B981'
                          }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => openModal('edit-task', task)} style={{ padding: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })} style={{ padding: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                          <Trash2 size={16} />
                        </button>
                        {task.status !== 'completed' && (
                          <button 
                            onClick={() => dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: 'completed' } })}
                            style={{ padding: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#10B981' }}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Team Members</h2>
        <button onClick={() => openModal('add-member')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <Plus size={16} />
          Add Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {state.teamMembers.map(member => (
          <div key={member.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#1F2937' }}>{member.name}</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>{member.role}</p>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: member.availability === 'full-time' ? '#10B98120' : '#F59E0B20',
                color: member.availability === 'full-time' ? '#10B981' : '#F59E0B'
              }}>
                {member.availability.toUpperCase()}
              </span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Skills:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {member.skills.map((skill, index) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '14px', color: '#6B7280' }}>
              <p style={{ margin: '4px 0' }}>
                Active Tasks: {state.tasks.filter(t => t.assignee === member.name && t.status !== 'completed').length}
              </p>
              <p style={{ margin: '4px 0' }}>
                Completed Tasks: {state.tasks.filter(t => t.assignee === member.name && t.status === 'completed').length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Analytics & Reports</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ marginTop: 0 }}>Project Completion Rate</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10B981', marginBottom: '10px' }}>
            {((calculateProjectStats().completed / calculateProjectStats().total) * 100).toFixed(1)}%
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>
            {calculateProjectStats().completed} of {calculateProjectStats().total} projects completed
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ marginTop: 0 }}>Average Team Efficiency</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '10px' }}>
            {math.mean(state.analytics.productivity.map(p => p.efficiency)).toFixed(1)}%
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Based on last 6 months data
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Resource Utilization</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {state.projects.map(project => {
            const utilization = (project.spent / project.budget) * 100;
            return (
              <div key={project.id} style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{project.name}</h4>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  border: '8px solid #E5E7EB', 
                  borderTopColor: utilization > 90 ? '#EF4444' : utilization > 70 ? '#F59E0B' : '#10B981',
                  margin: '0 auto 10px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {utilization.toFixed(0)}%
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
                  ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          width: '90%', 
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginTop: 0 }}>
            {modalType.includes('add') ? 'Add' : 'Edit'} {modalType.split('-')[1].charAt(0).toUpperCase() + modalType.split('-')[1].slice(1)}
          </h3>
          
          <form onSubmit={handleSubmit}>
            {modalType.includes('project') && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px', minHeight: '80px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Status</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Priority</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>End Date</label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Budget</label>
                    <input
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Progress (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress || 0}
                      onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Team Size</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.teamSize || 1}
                      onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </>
            )}

            {modalType.includes('task') && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px', minHeight: '60px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Project</label>
                    <select
                      value={formData.projectId || ''}
                      onChange={(e) => handleInputChange('projectId', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    >
                      <option value="">Select Project</option>
                      {state.projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Assignee</label>
                    <select
                      value={formData.assignee || ''}
                      onChange={(e) => handleInputChange('assignee', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    >
                      <option value="">Select Assignee</option>
                      {state.teamMembers.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Status</label>
                    <select
                      value={formData.status || 'pending'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Priority</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Estimated Hours</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimatedHours || ''}
                      onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Actual Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.actualHours || 0}
                      onChange={(e) => handleInputChange('actualHours', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </>
            )}

            {modalType.includes('member') && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Role</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || ''}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                    placeholder="e.g. React, Node.js, Python"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Availability</label>
                  <select
                    value={formData.availability || 'full-time'}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={closeModal}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#F3F4F6', 
                  color: '#374151',
                  border: '1px solid #D1D5DB', 
                  borderRadius: '6px', 
                  cursor: 'pointer' 
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer' 
                }}
              >
                {modalType.includes('add') ? 'Add' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ----- Main Render -----
  return (
    <div style={styles.container(darkMode)}>
      {/* Navigation Bar */}
      <nav style={styles.nav(darkMode)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <h1 style={styles.navTitle(darkMode)}>
            ProjectPilot: Advanced Project Management Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {['dashboard', 'projects', 'tasks', 'team', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={styles.navBtn(activeTab === tab, darkMode)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setDarkMode(d => !d)}
              style={{
                ...styles.navBtn(false, darkMode),
                background: 'transparent',
                border: 'none',
                fontSize: 20
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </nav>
      {/* Sidebar Quick Stats */}
      <div style={{ display: 'flex', maxWidth: 1400, margin: '32px auto', gap: 32 }}>
        <aside style={{ width: 280, ...styles.sidebar(darkMode), minHeight: 400 }}>
          <h3 style={{ marginTop: 0, color: darkMode ? '#ffb347' : '#3B82F6' }}>Quick Stats</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 16 }}>
            <li>Total Projects: <b>{calculateProjectStats().total}</b></li>
            <li>Active Projects: <b>{calculateProjectStats().active}</b></li>
            <li>Completed Projects: <b>{calculateProjectStats().completed}</b></li>
            <li>Total Tasks: <b>{calculateTaskStats().total}</b></li>
            <li>Overdue Tasks: <b style={{ color: '#EF4444' }}>{calculateTaskStats().overdue}</b></li>
            <li>Team Members: <b>{state.teamMembers.length}</b></li>
          </ul>
        </aside>
        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'analytics' && renderAnalytics()}
        </main>
      </div>
      {renderModal()}
      {/* Notifications */}
      <div className="notification-container">
        {notifications.slice(-3).map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}