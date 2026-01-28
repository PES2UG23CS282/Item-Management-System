const API_BASE_URL = 'https://item-management-system-shcm.onrender.com';

// ========== PAGE NAVIGATION ==========
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
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.add('show');
      return;
    }

    setToken(data.token);
    setUser(data.user);
    document.getElementById('loginForm').reset();
    errorDiv.classList.remove('show');
    switchPage('appPage');
    loadUserInfo();
    fetchItems();
  } catch (error) {
    errorDiv.textContent = 'Connection error. Make sure the server is running.';
    errorDiv.classList.add('show');
    console.error('Login error:', error);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const errorDiv = document.getElementById('registerError');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorDiv.textContent = data.error || 'Registration failed';
      errorDiv.classList.add('show');
      return;
    }

    setToken(data.token);
    setUser(data.user);
    document.getElementById('registerForm').reset();
    errorDiv.classList.remove('show');
    switchPage('appPage');
    loadUserInfo();
    fetchItems();
  } catch (error) {
    errorDiv.textContent = 'Connection error. Make sure the server is running.';
    errorDiv.classList.add('show');
    console.error('Register error:', error);
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
    const response = await fetch(`${API_BASE_URL}/items`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error('Failed to fetch items');
    }

    const items = await response.json();
    displayItems(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    document.getElementById('itemsList').innerHTML = '<p>Error loading items.</p>';
  }
}

function displayItems(items) {
  const itemsList = document.getElementById('itemsList');

  if (items.length === 0) {
    itemsList.innerHTML = '<p>No items yet. Add one to get started!</p>';
    return;
  }

  itemsList.innerHTML = items
    .map((item) => `
      <div class="item-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description) || 'No description'}</p>
        <div class="item-date">
          Created: ${new Date(item.createdAt).toLocaleDateString()}
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="openEditModal('${item._id}', '${escapeHtml(item.title)}', '${escapeHtml(item.description)}')">
            ✏️ Edit
          </button>
          <button class="btn-delete" onclick="deleteItem('${item._id}')">
            🗑️ Delete
          </button>
        </div>
      </div>
    `)
    .join('');
}

async function handleAddItem(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title) {
    alert('Please enter a title');
    return;
  }

  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error('Failed to add item');
    }

    document.getElementById('addItemForm').reset();
    fetchItems();
  } catch (error) {
    console.error('Error adding item:', error);
    alert('Error adding item');
  }
}

function openEditModal(id, title, description) {
  document.getElementById('editId').value = id;
  document.getElementById('editTitle').value = unescapeHtml(title);
  document.getElementById('editDescription').value = unescapeHtml(description);
  document.getElementById('editModal').style.display = 'block';
}

async function handleUpdateItem(e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();

  if (!title) {
    alert('Please enter a title');
    return;
  }

  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error('Failed to update item');
    }

    document.getElementById('editModal').style.display = 'none';
    fetchItems();
  } catch (error) {
    console.error('Error updating item:', error);
    alert('Error updating item');
  }
}

async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error('Failed to delete item');
    }

    fetchItems();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Error deleting item');
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
