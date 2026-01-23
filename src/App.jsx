import { useState, useEffect } from 'react';
import { Trash2, Check, Plus, Edit2, Save, X, Calendar, Flag } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      priority: priority,
      category: category,
      dueDate: dueDate,
      createdAt: new Date().toLocaleString()
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDate('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = filter === 'all' || 
                       (filter === 'active' && !todo.completed) || 
                       (filter === 'completed' && todo.completed);
    
    const categoryMatch = categoryFilter === 'all' || todo.category === categoryFilter;
    
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  const priorityColors = {
    high: 'border-red-400 bg-red-50',
    medium: 'border-yellow-400 bg-yellow-50',
    low: 'border-green-400 bg-green-50'
  };

  const priorityBadgeColors = {
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-green-500 text-white'
  };

  const categoryColors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-purple-100 text-purple-800',
    shopping: 'bg-pink-100 text-pink-800',
    health: 'bg-green-100 text-green-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Advanced To-Do List</h1>
            <p className="text-blue-100">Stay organized with priorities, categories & deadlines</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Input */}
          <div className="p-6 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addTodo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="px-6 pb-4">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
              {stats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="ml-auto px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Clear Completed
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded text-sm ${categoryFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All Categories
              </button>
              <button
                onClick={() => setCategoryFilter('work')}
                className={`px-3 py-1 rounded text-sm ${categoryFilter === 'work' ? categoryColors.work : 'bg-gray-200 text-gray-700'}`}
              >
                Work
              </button>
              <button
                onClick={() => setCategoryFilter('personal')}
                className={`px-3 py-1 rounded text-sm ${categoryFilter === 'personal' ? categoryColors.personal : 'bg-gray-200 text-gray-700'}`}
              >
                Personal
              </button>
              <button
                onClick={() => setCategoryFilter('shopping')}
                className={`px-3 py-1 rounded text-sm ${categoryFilter === 'shopping' ? categoryColors.shopping : 'bg-gray-200 text-gray-700'}`}
              >
                Shopping
              </button>
              <button
                onClick={() => setCategoryFilter('health')}
                className={`px-3 py-1 rounded text-sm ${categoryFilter === 'health' ? categoryColors.health : 'bg-gray-200 text-gray-700'}`}
              >
                Health
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="px-6 pb-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      todo.completed ? 'bg-green-50 border-green-200' : priorityColors[todo.priority]
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {todo.completed && <Check size={16} className="text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-1 border-2 border-blue-500 rounded focus:outline-none"
                            autoFocus
                          />
                          <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded">
                            <Save size={18} />
                          </button>
                          <button onClick={cancelEdit} className="text-red-600 hover:bg-red-50 p-1 rounded">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                              {todo.text}
                            </p>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityBadgeColors[todo.priority]}`}>
                              <Flag size={12} className="inline mr-1" />
                              {todo.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${categoryColors[todo.category]}`}>
                              {todo.category}
                            </span>
                          </div>
                          <div className="flex gap-3 mt-1">
                            <p className="text-xs text-gray-400">{todo.createdAt}</p>
                            {todo.dueDate && (
                              <p className="text-xs text-orange-600 flex items-center gap-1">
                                <Calendar size={12} />
                                Due: {new Date(todo.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {editingId !== todo.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(todo)}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
