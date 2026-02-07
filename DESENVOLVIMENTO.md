# Guia de Desenvolvimento

## Ambiente de Desenvolvimento

Esta seção é para quem quer contribuir ou modificar o código.

### Ferramentas Recomendadas

- **Editor**: VS Code, WebStorm, ou similar
- **Navegador**: Chrome DevTools, Firefox DevTools
- **Versão Control**: Git

### Extensões VS Code Recomendadas

```json
[
    "esbenp.prettier-vscode",        // Formatação
    "dbaeumer.vscode-eslint",        // Linting
    "ritwickdey.LiveServer",         // Live reload
    "Firefox.devtools",              // Firefox DevTools
    "Firebase.firebase",             // Firebase Integration
]
```

## Estrutura de Código

### index.html
- Contém toda a estrutura HTML
- Modal para autenticação
- Layout principal com sidebar
- Múltiplas páginas (dashboard, ativos, etc)

### CSS Modular
- `styles.css`: Estilos principais
- `responsive.css`: Media queries por breakpoint
- Variáveis CSS para tema

### JavaScript Modular
- `config.js`: Configuração e constantes
- `auth.js`: Lógica de autenticação
- `dashboard.js`: Dashboard e gráficos
- `ativos.js`: Gestão de ativos e transações
- `utils.js`: Funções auxiliares

## Desenvolvimento Local

### 1. Iniciar Servidor
```bash
npm start
# ou
python3 -m http.server 8000
```

### 2. Abrir Console do Navegador
- F12 ou Ctrl+Shift+I (Windows/Linux)
- Cmd+Option+I (Mac)
- Procure por erros em vermelho

### 3. Testar com DevTools Mobile
- F12 → Clique no ícone de dispositivo
- Selecione diferentes tamanhos de tela

## Adicionar Novas Funcionalidades

### Exemplo: Adicionar Nova Página

1. **Adicionar HTML em index.html:**
```html
<div id="nova-page" class="page">
    <h1>Minha Nova Página</h1>
    <!-- conteúdo -->
</div>
```

2. **Adicionar Link no Sidebar:**
```html
<a href="#" onclick="switchPage('nova')" class="nav-item">Nova Página</a>
```

3. **Adicionar Função em dashboard.js:**
```javascript
function switchPage(page) {
    // código existente...
    const titles = {
        // ...
        'nova': 'Nova Página'
    };
}
```

## Modificar Gráficos

Todos os gráficos usam Chart.js. Exemplo modificar:

```javascript
// dashboard.js
function createNovoChart() {
    const ctx = document.getElementById('novo-chart');
    
    new Chart(ctx, {
        type: 'line', // tipo: line, bar, pie, doughnut, radar
        data: {
            labels: ['Jan', 'Fev', 'Mar'],
            datasets: [{
                label: 'Meus Dados',
                data: [10, 20, 30],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-primary')
                    }
                }
            }
        }
    });
}
```

## Estilo e Design

### Paleta de Cores (CSS Variables)
```css
--primary-color: #2563eb;      /* Azul principal */
--secondary-color: #10b981;    /* Verde */
--danger-color: #ef4444;       /* Vermelho */
--warning-color: #f59e0b;      /* Laranja */
```

### Breakpoints de Responsividade
```css
Desktop:     > 1024px
Tablet:      768px - 1024px
Mobile:      < 768px
Small Mobile: < 480px
```

## Testar Firebase Localmente

### Emulador Firebase
```bash
# Instalar globalmente
npm install -g firebase-tools

# Inicializar no projeto
firebase init emulators

# Iniciar emulador
firebase emulators:start

# Alterar config.js para usar emulador
if (location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## Performance

### Otimizações Implementadas
- ✅ Images lazy-loaded
- ✅ CSS minificado
- ✅ JavaScript modular
- ✅ LocalStorage cache
- ✅ Gráficos responsivos

### Melhorias Sugeridas
- [ ] Minificar CSS/JS em produção
- [ ] Implementar service workers para offline
- [ ] Usar CSS-in-JS para estilos dinâmicos
- [ ] Implementar virtual scrolling para transações

## Debugging

### Console.log Úteis
```javascript
// Ver dados armazenados
console.log(StorageManager.getAssets());

// Ver usuário atual
console.log(StorageManager.getUser());

// Ver preços
console.log(currentPrices);
```

### Firebase Debug
```javascript
// Ativar logging do Firebase
firebase.firestore.enableLogging(true);

// Monitorar conexão
db.enableNetwork().then(() => {
    console.log('Conectado ao Firestore');
});
```

## Testes

### Teste Manual de Funcionalidades
- [ ] Login/Logout
- [ ] Criar conta nova
- [ ] Adicionar ativo
- [ ] Editar ativo
- [ ] Remover ativo
- [ ] Filtrar transações
- [ ] Mudar para modo escuro
- [ ] Imprimir portfólio
- [ ] Responsividade em mobile

### Teste em Diferentes Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Commits Boas Práticas

```bash
# Criar feature branch
git checkout -b feature/adicionar-relatorios

# Fazer commits significativos
git commit -m "feat: Adicionar exportação PDF"

# Tipos recomendados
- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- style: Formatação
- refactor: Restructuração
- perf: Performance
- test: Testes
```

## Build para Produção

### Minificar Assets
```bash
# CSS
npx csso css/styles.css -o css/styles.min.css

# JavaScript
npx terser js/dashboard.js -o js/dashboard.min.js
```

### Deploy

**Firebase Hosting:**
```bash
firebase deploy --only hosting
```

**GitHub Pages:**
```bash
git push origin main
# Ativar em Settings > Pages
```

**Vercel:**
```bash
vercel deploy
```

## Troubleshooting Desenvolvimento

### "Firebase não está inicializando"
1. Verifique credenciais em config.js
2. Verifique console (F12)
3. Teste com console.log(firebase)

### "Gráficos não aparecem"
1. Verifique se Chart.js está carregado
2. Verifique se elemento DOM existe
3. Teste com devtools mobile

### "Dados não salvam"
1. Verifique localStorage: `localStorage.getItem('assets')`
2. Teste Firebase Emulator
3. Verifique regras Firestore

### "CORS Error"
1. Adicione CORS headers no servidor
2. Use proxy se necessário
3. Teste em localhost

## Documentação Adicional

- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [Firebase Docs](https://firebase.google.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)

---

**Happy Coding! 🚀**
