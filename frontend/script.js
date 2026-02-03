// ✅ CORRECT (Use YOUR Render link)
const API_BASE_URL = 'https://item-management-system-shcm.onrender.com';

// ========== GLOBAL STATE ==========
let allItems = [];
let currentFilter = {
  search: '',
  priority: 'all',
  status: 'all'
};

// ========== FILTER AND SEARCH LOGIC ==========
function applyFilters() {
  let filtered = [...allItems];
  
  // Apply search filter
  if (currentFilter.search.trim()) {
    const searchLower = currentFilter.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      (item.priority && item.priority.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply priority filter
  if (currentFilter.priority !== 'all') {
    filtered = filtered.filter(item => item.priority === currentFilter.priority);
  }
  
  // Apply status filter
  if (currentFilter.status !== 'all') {
    filtered = filtered.filter(item => item.status === currentFilter.status);
  }
  
  displayItems(filtered);
}

function searchItems(query) {
  currentFilter.search = query;
  applyFilters();
}

function filterByPriority(priority) {
  currentFilter.priority = priority;
  applyFilters();
}

function filterByStatus(status) {
  currentFilter.status = status;
  applyFilters();
}

function resetFilters() {
  currentFilter.search = '';
  currentFilter.priority = 'all';
  currentFilter.status = 'all';
  document.getElementById('searchInput').value = '';
  document.getElementById('priorityFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';
  displayItems(allItems);
}
function switchPage(pageName) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageName).classList.add('active');
}

// ========== LOCAL STORAGE HELPERS ==========
function setToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

function clearToken() {
  localStorage.removeItem('token');
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function clearUser() {
  localStorage.removeItem('user');
}

// ========== CHECK AUTHENTICATION ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token) {
    switchPage('appPage');
    loadUserInfo();
    fetchItems();
  } else {
    switchPage('loginPage');
  }

  setupEventListeners();
});

// ========== SETUP EVENT LISTENERS ==========
function setupEventListeners() {
  // Auth Forms
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Item Forms
  document.getElementById('addItemForm').addEventListener('submit', handleAddItem);
  document.getElementById('editItemForm').addEventListener('submit', handleUpdateItem);

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      searchItems(e.target.value);
    });
  }

  // Modal
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// ========== AUTHENTICATION FUNCTIONS ==========
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorDiv = document.getElementById('loginError');

  if (!email || !password) {
    errorDiv.textContent = 'Please enter email and password';
    errorDiv.classList.add('show');
    return;
  }

  try {
    console.log('📧 Logging in with:', email);
    // ✅ FIXED: Added /api path
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('✅ Login response:', data);

    if (!response.ok) {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.add('show');
      return;
    }

    setToken(data.token);
    setUser(data.user);
    document.getElementById('loginForm').reset();
    errorDiv.classList.remove('show');
    console.log('✅ Login successful, switching to app page');
    switchPage('appPage');
    loadUserInfo();
    fetchItems();
  } catch (error) {
    console.error('❌ Login error:', error);
    // ✅ FIXED: Removed misleading port 5000 message
    errorDiv.textContent = 'Network connection error. Please try again.';
    errorDiv.classList.add('show');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
  const errorDiv = document.getElementById('registerError');

  // Frontend validation
  if (!username || !email || !password || !confirmPassword) {
    errorDiv.textContent = 'All fields are required';
    errorDiv.classList.add('show');
    return;
  }

  if (password !== confirmPassword) {
    errorDiv.textContent = 'Passwords do not match';
    errorDiv.classList.add('show');
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters';
    errorDiv.classList.add('show');
    return;
  }

  try {
    console.log('👤 Registering user:', username, email);
    // ✅ FIXED: Added /api path
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await response.json();
    console.log('✅ Register response:', data);

    if (!response.ok) {
      errorDiv.textContent = data.error || 'Registration failed';
      errorDiv.classList.add('show');
      return;
    }

    setToken(data.token);
    setUser(data.user);
    document.getElementById('registerForm').reset();
    errorDiv.classList.remove('show');
    console.log('✅ Registration successful, switching to app page');
    switchPage('appPage');
    loadUserInfo();
    fetchItems();
  } catch (error) {
    console.error('❌ Register error:', error);
    // ✅ FIXED: Removed misleading port 5000 message
    errorDiv.textContent = 'Network connection error. Please try again.';
    errorDiv.classList.add('show');
  }
}

function handleLogout() {
  clearToken();
  clearUser();
  document.getElementById('loginForm').reset();
  document.getElementById('registerForm').reset();
  document.getElementById('addItemForm').reset();
  switchPage('loginPage');
}

function loadUserInfo() {
  const user = getUser();
  if (user) {
    document.getElementById('userDisplay').textContent = `👤 ${user.username}`;
  }
}

// ========== ITEM CRUD FUNCTIONS ==========
async function fetchItems() {
  try {
    const token = getToken();
    // ✅ FIXED: Added /api path
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error('Failed to fetch items');
    }

    allItems = await response.json();
    displayItems(allItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    document.getElementById('itemsList').innerHTML = '<p>Error loading items.</p>';
  }
}

function displayItems(items) {
  const itemsList = document.getElementById('itemsList');

  if (!items || items.length === 0) {
    itemsList.innerHTML = '<p>🔍 No items found. Try adjusting your filters or add a new item!</p>';
    return;
  }

  console.log(`📊 Displaying ${items.length} items`);

  itemsList.innerHTML = items
    .map((item) => `
      <div class="item-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description) || 'No description'}</p>
        <div class="item-meta">
          <span class="item-date">📅 ${new Date(item.createdAt).toLocaleDateString()}</span>
          ${item.priority ? `<span class="item-priority priority-${item.priority}">🎯 ${item.priority.toUpperCase()}</span>` : ''}
          ${item.status ? `<span class="item-status status-${item.status}">${item.status === 'completed' ? '✅ DONE' : '⏳ PENDING'}</span>` : ''}
        </div>
        <div class="item-actions">
          <button class="btn-edit" data-id="${item._id}" type="button">
            ✏️ Edit
          </button>
          <button class="btn-delete" data-id="${item._id}" type="button">
            🗑️ Delete
          </button>
        </div>
      </div>
    `)
    .join('');
  
  // Add event listeners to edit buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      const item = allItems.find(i => i._id === itemId);
      console.log('Edit item:', item);
      if (item) {
        openEditModal(item);
      }
    });
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      console.log('Delete item:', itemId);
      deleteItem(itemId);
    });
  });
}

async function handleAddItem(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const priority = document.getElementById('itemPriority').value;
  const status = document.getElementById('itemStatus').value;

  if (!title) {
    alert('❌ Please enter a title');
    return;
  }

  try {
    console.log('💾 Adding item:', { title, description, priority, status });
    const token = getToken();
    // ✅ FIXED: Added /api path
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, priority, status }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error response:', error);
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error(error.error || 'Failed to add item');
    }

    const newItem = await response.json();
    console.log('✅ Item added successfully:', newItem);
    
    document.getElementById('addItemForm').reset();
    document.getElementById('itemPriority').value = 'medium';
    document.getElementById('itemStatus').value = 'pending';
    
    fetchItems();
  } catch (error) {
    console.error('❌ Error adding item:', error);
    alert('❌ Error adding item: ' + error.message);
  }
}

function openEditModal(item) {
  document.getElementById('editId').value = item._id;
  document.getElementById('editTitle').value = item.title;
  document.getElementById('editDescription').value = item.description;
  document.getElementById('editPriority').value = item.priority || 'medium';
  document.getElementById('editStatus').value = item.status || 'pending';
  document.getElementById('editModal').style.display = 'block';
}

async function handleUpdateItem(e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  const priority = document.getElementById('editPriority').value;
  const status = document.getElementById('editStatus').value;

  if (!title) {
    alert('❌ Please enter a title');
    return;
  }

  try {
    console.log('🔄 Updating item:', { id, title, description, priority, status });
    const token = getToken();
    // ✅ FIXED: Added /api path
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, priority, status }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error response:', error);
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error(error.error || 'Failed to update item');
    }

    const updatedItem = await response.json();
    console.log('✅ Item updated successfully:', updatedItem);
    
    document.getElementById('editModal').style.display = 'none';
    fetchItems();
  } catch (error) {
    console.error('❌ Error updating item:', error);
    alert('❌ Error updating item: ' + error.message);
  }
}

async function deleteItem(id) {
  if (!confirm('⚠️ Are you sure you want to delete this item? This action cannot be undone.')) {
    return;
  }

  try {
    console.log('🗑️ Deleting item:', id);
    const token = getToken();
    // ✅ FIXED: Added /api path
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error response:', error);
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error(error.error || 'Failed to delete item');
    }

    console.log('✅ Item deleted successfully');
    fetchItems();
  } catch (error) {
    console.error('❌ Error deleting item:', error);
    alert('❌ Error deleting item: ' + error.message);
  }
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function unescapeHtml(text) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => map[m]);
}