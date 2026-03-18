// Lógica principal del frontend para Gimnasio FitLife
const API_URL = '/api';

// Estado global
let currentUser = null;
let userPlan = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  loadGymInfo();
  loadPlanes();
  loadStats();
  loadReseñas();
  loadReseñasStats();
  checkLoginStatus();
  updateResenaFormForUser();
  setupEventListeners();
  
  // Copiar datos al footer
  copyFooterInfo();
});

// Event Listeners
function setupEventListeners() {
  // Formulario de registro
  const registroForm = document.getElementById('registroForm');
  if (registroForm) {
    registroForm.addEventListener('submit', handleRegistro);
  }

  // Formulario de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Formulario de inscripción
  const inscripcionForm = document.getElementById('inscripcion');
  if (inscripcionForm) {
    inscripcionForm.addEventListener('submit', handleInscripcion);
  }

  // Formulario de pago
  const pagoForm = document.getElementById('pago');
  if (pagoForm) {
    pagoForm.addEventListener('submit', handlePago);
  }

  // Formulario de reseñas
  const resenaForm = document.getElementById('resena-form');
  if (resenaForm) {
    resenaForm.addEventListener('submit', handleNuevaResena);
  }
  
  // Navigation scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
  });
}

// Copiar info al footer
function copyFooterInfo() {
  setTimeout(() => {
    const ubicacion = document.getElementById('ubicacion')?.textContent;
    const telefono = document.getElementById('telefono')?.textContent;
    const contacto = document.getElementById('contacto')?.textContent;
    
    if (ubicacion && document.getElementById('footer-ubicacion')) {
      document.getElementById('footer-ubicacion').textContent = ubicacion;
    }
    if (telefono && document.getElementById('footer-telefono')) {
      document.getElementById('footer-telefono').textContent = telefono;
    }
    if (contacto && document.getElementById('footer-contacto')) {
      document.getElementById('footer-contacto').textContent = contacto;
    }
  }, 1000);
}

// Mostrar modal de autenticación
function showAuthModal(type) {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    switchAuthTab(type);
  }
}

// Cerrar modal de autenticación
function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Cambiar tab de autenticación
function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginContainer = document.getElementById('login-form-container');
  const registerContainer = document.getElementById('register-form-container');
  
  tabs.forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
  
  if (tab === 'login') {
    if (loginContainer) loginContainer.style.display = 'block';
    if (registerContainer) registerContainer.style.display = 'none';
  } else {
    if (loginContainer) loginContainer.style.display = 'none';
    if (registerContainer) registerContainer.style.display = 'block';
  }
}

// Cargar información del gimnasio
async function loadGymInfo() {
  try {
    const response = await fetch(`${API_URL}/info`);
    const data = await response.json();

    const descripcion = document.getElementById('descripcion');
    const ubicacion = document.getElementById('ubicacion');
    const contacto = document.getElementById('contacto');
    const telefono = document.getElementById('telefono');
    const horario = document.getElementById('horario');

    if (descripcion) descripcion.textContent = data.descripcion;
    if (ubicacion) ubicacion.textContent = data.ubicacion;
    if (contacto) contacto.textContent = data.contacto;
    if (telefono) telefono.textContent = data.telefono;
    if (horario) horario.textContent = data.horario;

    // Cargar testimonios
    const testimoniosContainer = document.getElementById('testimonios');
    if (testimoniosContainer && data.testimonios) {
      data.testimonios.forEach(t => {
        const div = document.createElement('div');
        div.className = 'testimonio-card';
        div.innerHTML = `
          <img src="${t.imagen}" alt="${t.nombre}" class="testimonio-img">
          <p class="testimonio-texto">"${t.comentario}"</p>
          <p class="testimonio-autor">- ${t.nombre}</p>
        `;
        testimoniosContainer.appendChild(div);
      });
    }
  } catch (err) {
    console.error('Error cargando info:', err);
  }
}

// Cargar planes con estilo profesional
async function loadPlanes() {
  try {
    const response = await fetch(`${API_URL}/planes`);
    const planes = await response.json();

    const planesContainer = document.getElementById('planes-grid');
    if (!planesContainer) return;

    planesContainer.innerHTML = '';

    planes.forEach((plan, index) => {
      const div = document.createElement('div');
      const isFeatured = index === 1;
      div.className = `plan-card ${isFeatured ? 'featured' : ''}`;
      div.innerHTML = `
        <div class="plan-header">
          <h3>${plan.nombre}</h3>
          <div class="precio">$${plan.precio}<span>/mes</span></div>
        </div>
        <div class="plan-body">
          <ul>
            <li><i class="fas fa-check"></i> ${plan.descripcion}</li>
            <li><i class="fas fa-check"></i> Acceso a instalaciones</li>
            <li><i class="fas fa-check"></i> Horario flexible</li>
            <li><i class="fas fa-check"></i> Estacionamiento gratuito</li>
          </ul>
          <button class="btn-elegir" onclick="selectPlan(${plan.id}, '${plan.nombre}')">Elegir Plan</button>
        </div>
      `;
      planesContainer.appendChild(div);
    });

    // Llenar select de planes
    const planSelect = document.getElementById('planSelect');
    if (planSelect) {
      planSelect.innerHTML = '';
      planes.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id;
        option.textContent = `${plan.nombre} - $${plan.precio}`;
        planSelect.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Error cargando planes:', err);
  }
}

// Seleccionar plan
function selectPlan(planId, planNombre) {
  if (currentUser) {
    // Usuario logueado: seleccionar plan y mostrar formulario de inscripción
    document.getElementById('planSelect').value = planId;
    document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
  } else {
    // Usuario no logueado: mostrar modal de registro
    showAuthModal('register');
  }
}

// Cargar estadísticas con animación
async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const stats = await response.json();

    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    const statCards = statsContainer.querySelectorAll('.stat-card');
    
    if (statCards[0]) animateNumber(statCards[0].querySelector('.stat-number'), stats.totalUsuarios || 0);
    if (statCards[1]) animateNumber(statCards[1].querySelector('.stat-number'), stats.suscripcionesActivas || 0);
    if (statCards[2]) {
      const precioEl = statCards[2].querySelector('.stat-number');
      animateNumber(precioEl, stats.precioPromedio || 0, '$');
    }
    if (statCards[3]) animateNumber(statCards[3].querySelector('.stat-number'), stats.planesUnicos || 0);
  } catch (err) {
    console.error('Error cargando stats:', err);
  }
}

// Animar números
function animateNumber(element, target, prefix = '') {
  if (!element) return;
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    element.textContent = prefix + current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Cargar datos del usuario
async function loadUserData(email) {
  try {
    const response = await fetch(`${API_URL}/usuario?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    if (data.id) {
      currentUser = { ...currentUser, ...data };
      updateUIForLoggedInUser(data);
    }
  } catch (err) {
    console.error('Error cargando datos del usuario:', err);
  }
}

// Actualizar UI cuando el usuario está logueado
function updateUIForLoggedInUser(user) {
  // Actualizar navegación
  const btnLoginNav = document.getElementById('btn-login-nav');
  const btnRegisterNav = document.getElementById('btn-register-nav');
  const userMenu = document.getElementById('user-menu');
  const userGreeting = document.getElementById('user-greeting');

  if (btnLoginNav) btnLoginNav.style.display = 'none';
  if (btnRegisterNav) btnRegisterNav.style.display = 'none';
  if (userMenu) {
    userMenu.style.display = 'flex';
    if (userGreeting) userGreeting.textContent = `Hola, ${user.nombre}`;
  }

  // Mostrar dashboard
  const dashboardSection = document.getElementById('dashboard-section');
  if (dashboardSection) {
    dashboardSection.style.display = 'block';
    dashboardSection.scrollIntoView({ behavior: 'smooth' });
    
    // Actualizar datos del dashboard
    const dashName = document.getElementById('dashboard-user-name');
    const profileNombre = document.getElementById('profile-nombre');
    const profileEmail = document.getElementById('profile-email');
    const profileFecha = document.getElementById('profile-fecha');
    
    if (dashName) dashName.textContent = user.nombre;
    if (profileNombre) profileNombre.textContent = user.nombre;
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileFecha) profileFecha.textContent = new Date(user.created_at).toLocaleDateString();
    
    // Mostrar estado de suscripción
    const suscripcionStatus = document.getElementById('suscripcion-status');
    const cambiarPlanContainer = document.getElementById('cambiar-plan-container');
    
    // Verificar expiración
    const status = user.suscripcionStatus || { expirada: true, diasRestantes: 0 };
    const suscripcion = user.suscripcionActual;
    
    if (suscripcionStatus) {
      if (user.planActual && user.plan_id && suscripcion) {
        // Tiene plan activo
        const estadoClase = status.expirada ? 'expired' : 'active';
        const estadoTexto = status.expirada ? 'Vencida' : 'Activa';
        const estadoIcono = status.expirada ? 'fa-clock' : 'fa-check-circle';
        
        suscripcionStatus.innerHTML = `
          <div class="status-badge ${estadoClase}">
            <i class="fas ${estadoIcono}"></i>
            <span>${estadoTexto}</span>
          </div>
          <p class="dias-restantes">${status.expirada ? 'Tu plan venció' : `${status.diasRestantes} días restantes`}</p>
          <p class="fecha-fin">Vence: ${new Date(suscripcion.fecha_fin).toLocaleDateString()}</p>
        `;
        
        // Mostrar botón cambiar plan si está vencido o siempre visible para cambiar
        if (cambiarPlanContainer) {
          cambiarPlanContainer.style.display = 'block';
          const btnCambiarPlan = document.getElementById('btn-cambiar-plan');
          if (btnCambiarPlan) {
            btnCambiarPlan.textContent = status.expirada ? 'Renovar Plan' : 'Cambiar Plan';
          }
        }
      } else {
        // No tiene plan activo
        suscripcionStatus.innerHTML = `
          <div class="status-badge expired">
            <i class="fas fa-times-circle"></i>
            <span>Sin Plan</span>
          </div>
        `;
        
        if (cambiarPlanContainer) {
          cambiarPlanContainer.style.display = 'block';
          const btnCambiarPlan = document.getElementById('btn-cambiar-plan');
          if (btnCambiarPlan) {
            btnCambiarPlan.textContent = 'Adquirir Plan';
          }
        }
      }
    }
    
    // Mostrar plan actual
    const userPlanInfo = document.getElementById('user-plan-info');
    if (userPlanInfo) {
      if (user.planActual && user.plan_id) {
        userPlanInfo.innerHTML = `
          <p><strong>Plan:</strong> ${user.planActual.nombre}</p>
          <p><strong>Precio:</strong> $${user.planActual.precio}/mes</p>
          <p><strong>Descripción:</strong> ${user.planActual.descripcion}</p>
          <p><strong>Inicio:</strong> ${suscripcion ? new Date(suscripcion.fecha_inicio).toLocaleDateString() : '-'}</p>
        `;
      } else {
        userPlanInfo.innerHTML = '<p class="no-plan">No tienes un plan activo</p>';
      }
    }
    
    // Mostrar historial
    const userHistory = document.getElementById('user-history');
    if (userHistory && user.suscripciones && user.suscripciones.length > 0) {
      userHistory.innerHTML = user.suscripciones.slice(0, 5).map(s => {
        const estado = s.estado === 'activa' ? 'active' : (s.estado === 'vencida' ? 'expired' : '');
        return `<p><strong>${s.plan_nombre}</strong> - $${s.monto} (${new Date(s.creado_at).toLocaleDateString()})</p>`;
      }).join('');
    }
  }

  // Cerrar modal si está abierto
  closeAuthModal();
}

// Función para verificar si el plan está vencido (expuesta globalmente)
function isPlanExpirado(userData) {
  if (!userData || !userData.suscripcionStatus) return true;
  return userData.suscripcionStatus.expirada;
}

// Manejar registro
async function handleRegistro(e) {
  e.preventDefault();
  const form = e.target;
  const nombre = form.nombre.value;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const result = await response.json();

    if (result.ok) {
      showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
      form.reset();
      handleLoginSubmit(email, password);
    } else {
      showMessage(result.error, 'error');
    }
  } catch (err) {
    showMessage('Error en el registro', 'error');
  }
}

// Manejar login
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  await handleLoginSubmit(email, password);
}

// Función auxiliar para login
async function handleLoginSubmit(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.ok) {
      currentUser = result.user;
      localStorage.setItem('gymUser', JSON.stringify(currentUser));
      
      showMessage(`¡Bienvenido, ${result.user.nombre}!`, 'success');
      
      loadUserData(email);
    } else {
      showMessage(result.error, 'error');
    }
  } catch (err) {
    showMessage('Error al iniciar sesión', 'error');
  }
}

// Mostrar sección de planes (desde dashboard)
function showPlansSection() {
  document.getElementById('planes').scrollIntoView({ behavior: 'smooth' });
}

// Manejar inscripción a plan
async function handleInscripcion(e) {
  e.preventDefault();
  const planSelect = document.getElementById('planSelect');
  const planId = planSelect.value;

  if (!currentUser) {
    showAuthModal('login');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/inscribir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        planId: parseInt(planId)
      })
    });

    const result = await response.json();

    if (result.ok) {
      document.getElementById('planElegido').textContent = result.plan.nombre;
      document.getElementById('inscripcion').style.display = 'none';
      document.getElementById('pago').style.display = 'block';
      showMessage('Plan seleccionado. Procede al pago.', 'success');
    } else {
      showMessage(result.error, 'error');
    }
  } catch (err) {
    showMessage('Error al inscribir al plan', 'error');
  }
}

// Manejar pago
async function handlePago(e) {
  e.preventDefault();

  if (!currentUser) {
    showAuthModal('login');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email })
    });

    const result = await response.json();

    if (result.ok) {
      showMessage('¡Pago realizado con éxito!', 'success');
      document.getElementById('pago').style.display = 'none';
      
      loadUserData(currentUser.email);
      currentUser.plan_id = document.getElementById('planSelect').value;
      localStorage.setItem('gymUser', JSON.stringify(currentUser));
    } else {
      showMessage(result.error || 'Error en el pago', 'error');
    }
  } catch (err) {
    showMessage('Error al procesar pago', 'error');
  }
}

// Cerrar sesión
function logout() {
  currentUser = null;
  localStorage.removeItem('gymUser');
  
  // Ocultar dashboard
  const dashboardSection = document.getElementById('dashboard-section');
  if (dashboardSection) {
    dashboardSection.style.display = 'none';
  }
  
  // Mostrar botones de nav
  const btnLoginNav = document.getElementById('btn-login-nav');
  const btnRegisterNav = document.getElementById('btn-register-nav');
  const userMenu = document.getElementById('user-menu');
  
  if (btnLoginNav) btnLoginNav.style.display = 'block';
  if (btnRegisterNav) btnRegisterNav.style.display = 'block';
  if (userMenu) userMenu.style.display = 'none';

  showMessage('Sesión cerrada', 'success');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Verificar estado de login
function checkLoginStatus() {
  const savedUser = localStorage.getItem('gymUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    loadUserData(currentUser.email);
  }
}

// Mostrar mensajes
function showMessage(msg, type) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${msg}</span>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    .toast {
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 10px;
      color: white;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 3000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .toast-success { background: #28a745; }
    .toast-error { background: #dc3545; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Cargar estadísticas de reseñas
async function loadReseñasStats() {
  try {
    const response = await fetch(`${API_URL}/resenas/stats`);
    const stats = await response.json();

    const promedioEl = document.getElementById('stats-promedio');
    const totalEl = document.getElementById('stats-total');
    const estrellasEl = document.getElementById('stats-estrellas');

    if (promedioEl) {
      promedioEl.textContent = stats.promedio || '0.0';
    }
    if (totalEl) {
      totalEl.textContent = `${stats.total || 0} reseñas`;
    }
    if (estrellasEl) {
      const promedio = parseFloat(stats.promedio) || 0;
      const fullStars = Math.round(promedio);
      estrellasEl.innerHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    }

    // Actualizar barras de distribución
    const total = stats.total || 0;
    const distribucion = [
      { stars: 5, count: stats.cinco_estrellas || 0 },
      { stars: 4, count: stats.cuatro_estrellas || 0 },
      { stars: 3, count: stats.tres_estrellas || 0 },
      { stars: 2, count: stats.dos_estrellas || 0 },
      { stars: 1, count: stats.uno_estrellas || 0 }
    ];

    distribucion.forEach(d => {
      const barEl = document.getElementById(`bar-${d.stars}`);
      const countEl = document.getElementById(`count-${d.stars}`);
      const percentage = total > 0 ? (d.count / total) * 100 : 0;
      
      if (barEl) barEl.style.width = `${percentage}%`;
      if (countEl) countEl.textContent = d.count;
    });
  } catch (err) {
    console.error('Error cargando estadísticas de reseñas:', err);
  }
}

// Cargar reseñas
async function loadReseñas() {
  try {
    const response = await fetch(`${API_URL}/resenas`);
    
    // Verificar que la respuesta sea exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const reseñas = await response.json();

    // Verificar que la respuesta sea un array
    if (!Array.isArray(reseñas)) {
      console.error('La respuesta no es un array:', reseñas);
      const container = document.getElementById('reseñas-container');
      if (container) {
        container.innerHTML = '<p class="no-reseñas">Error al cargar las reseñas. Por favor, intenta más tarde.</p>';
      }
      return;
    }

    const container = document.getElementById('reseñas-container');
    if (!container) return;

    container.innerHTML = '';

    if (reseñas.length === 0) {
      container.innerHTML = '<p class="no-reseñas">Aún no hay reseñas. ¡Sé el primero en opinar!</p>';
      return;
    }

    reseñas.forEach(r => {
      const isVerified = r.usuario_id != null;
      const utilCount = r.util_count || 0;
      
      const div = document.createElement('div');
      div.className = 'review-card';
      div.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <span class="reviewer-name">${r.nombre}</span>
            ${isVerified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verificado</span>' : ''}
          </div>
          <span class="review-stars">${'★'.repeat(r.calificacion)}${'☆'.repeat(5 - r.calificacion)}</span>
        </div>
        <p class="review-text">${r.comentario || 'Sin comentario'}</p>
        <div class="review-footer">
          <span class="review-date">${new Date(r.creado_at).toLocaleDateString()}</span>
          <button class="util-btn" onclick="handleUtil(${r.id})" data-id="${r.id}">
            <i class="fas fa-thumbs-up"></i> <span class="util-count">${utilCount}</span> Me fue útil
          </button>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando reseñas:', err);
  }
}

// Manejar botón "me fue útil"
async function handleUtil(resenaId) {
  if (!currentUser) {
    showMessage('Inicia sesión para marcar esta reseña como útil', 'info');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/resenas/${resenaId}/util`, {
      method: 'POST'
    });
    const result = await response.json();

    if (result.ok) {
      // Actualizar el contador en la UI
      const btn = document.querySelector(`.util-btn[data-id="${resenaId}"]`);
      if (btn) {
        const countSpan = btn.querySelector('.util-count');
        const currentCount = parseInt(countSpan.textContent) || 0;
        countSpan.textContent = currentCount + 1;
        btn.classList.add('util-active');
        btn.disabled = true;
      }
      showMessage('¡Gracias por tu retroalimentación!', 'success');
    }
  } catch (err) {
    console.error('Error al marcar como útil:', err);
  }
}

// Actualizar formulario de reseñas según estado de usuario
function updateResenaFormForUser() {
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const nombreInput = document.getElementById('resena-nombre');
  const emailInput = document.getElementById('resena-email');

  if (currentUser && currentUser.id) {
    if (formTitle) {
      formTitle.innerHTML = '<i class="fas fa-pen"></i> Comparte tu Experiencia <span class="verified-badge"><i class="fas fa-check-circle"></i> Usuario Verificado</span>';
    }
    if (formSubtitle) {
      formSubtitle.textContent = 'Tu opinión como miembro verificado tiene más peso';
    }
    if (nombreInput) {
      nombreInput.value = currentUser.nombre || '';
      nombreInput.readOnly = true;
    }
    if (emailInput) {
      emailInput.value = currentUser.email || '';
      emailInput.readOnly = true;
    }
  }
}

// Enviar nueva reseña
async function handleNuevaResena(e) {
  e.preventDefault();

  const nombre = document.getElementById('resena-nombre')?.value.trim();
  const email = document.getElementById('resena-email')?.value.trim();
  const comentario = document.getElementById('resena-comentario')?.value.trim();
  
  const ratingInputs = document.querySelectorAll('input[name="rating"]');
  let calificacion = 0;
  ratingInputs.forEach(input => {
    if (input.checked) calificacion = parseInt(input.value);
  });

  if (!nombre || !calificacion) {
    showMessage('Por favor ingresa tu nombre y una calificación', 'error');
    return;
  }

  // Incluir usuario_id si está logueado
  const usuario_id = currentUser?.id || null;

  try {
    const response = await fetch(`${API_URL}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, calificacion, comentario, usuario_id })
    });

    const result = await response.json();

    if (result.ok) {
      showMessage('¡Gracias! Tu opinión ha sido enviada y será visible tras ser aprobada.', 'success');
      document.getElementById('resena-form')?.reset();
    } else {
      showMessage(result.error, 'error');
    }
  } catch (err) {
    showMessage('Error al enviar la reseña', 'error');
  }
}
