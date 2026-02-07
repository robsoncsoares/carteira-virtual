// ===== GERENCIAMENTO DE AUTENTICAÇÃO =====

// Verificar se usuário está autenticado ao carregar
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // Listeners de autenticação
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged((user) => {
            if (user) {
                showApp(user);
            } else {
                showAuth();
            }
        });
    }
    
    // Listeners dos formulários
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function checkAuthStatus() {
    const user = StorageManager.getUser();
    if (user) {
        showApp(user);
    } else {
        showAuth();
    }
}

function switchTab(tab) {
    // Ocultar todos os formulários
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    
    // Remover active de botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar formulário selecionado
    if (tab === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('register-form').classList.remove('hidden');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
    
    // Limpar mensagens de erro
    document.getElementById('login-error').classList.remove('show');
    document.getElementById('register-error').classList.remove('show');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    try {
        errorElement.classList.remove('show');
        
        // Se Firebase está disponível, usar Firebase
        if (typeof auth !== 'undefined') {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName || email.split('@')[0],
                createdAt: new Date().toISOString()
            };
            StorageManager.saveUser(user);
            showApp(user);
        } else {
            // Modo offline - login simulado
            const user = {
                uid: 'demo-' + Date.now(),
                email: email,
                displayName: email.split('@')[0],
                createdAt: new Date().toISOString()
            };
            StorageManager.saveUser(user);
            showApp(user);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorElement.textContent = 'Email ou senha incorretos. Tente novamente.';
        errorElement.classList.add('show');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const errorElement = document.getElementById('register-error');
    
    try {
        errorElement.classList.remove('show');
        
        // Validações
        if (password !== confirm) {
            throw new Error('As senhas não correspondem');
        }
        
        if (password.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        
        // Se Firebase está disponível, usar Firebase
        if (typeof auth !== 'undefined') {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Atualizar perfil
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            const user = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: name,
                createdAt: new Date().toISOString()
            };
            
            StorageManager.saveUser(user);
            showApp(user);
        } else {
            // Modo offline - registro simulado
            const user = {
                uid: 'demo-' + Date.now(),
                email: email,
                displayName: name,
                createdAt: new Date().toISOString()
            };
            StorageManager.saveUser(user);
            showApp(user);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        
        let message = error.message;
        
        // Mensagens customizadas
        if (error.code === 'auth/email-already-in-use') {
            message = 'Este email já está registrado';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Email inválido';
        } else if (error.code === 'auth/weak-password') {
            message = 'Senha muito fraca';
        }
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
}

function showApp(user) {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    
    // Atualizar informações do usuário
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-avatar').textContent = user.displayName.charAt(0).toUpperCase();
    document.getElementById('profile-email').value = user.email;
    document.getElementById('profile-name').value = user.displayName;
    document.getElementById('profile-date').value = formatDate(user.createdAt);
    
    // Carregar dados
    loadDashboard();
    loadAtivos();
    loadTransactions();
}

async function logout() {
    try {
        if (typeof auth !== 'undefined') {
            await auth.signOut();
        }
        
        // Limpar dados locais
        localStorage.removeItem('currentUser');
        localStorage.removeItem('assets');
        localStorage.removeItem('transactions');
        
        StorageManager.currentUser = null;
        StorageManager.assets = [];
        StorageManager.transactions = [];
        
        showAuth();
        switchTab('login');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao sair. Tente novamente.');
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function editProfile() {
    alert('Funcionalidade em desenvolvimento');
}

function toggleDarkMode() {
    const checkbox = document.getElementById('dark-mode');
    if (checkbox.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
}

// Carregar preferência de dark mode
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const checkbox = document.getElementById('dark-mode');
        if (checkbox) checkbox.checked = true;
    }
});
