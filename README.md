# 🏋️ Gimnasio FitLife - Website

Sitio web moderno para gimnasio con diseño neón verde / negro / blanco.

![Preview](https://via.placeholder.com/800x400?text=FitLife+Gym)

## ✨ Características

- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Tema neón verde / negro / blanco
- ✅ Planes de suscripción (Básico, Premium, VIP)
- ✅ Sistema de usuarios y autenticación
- ✅ Reseñas de clientes
- ✅ Panel de usuario personalizado
- ✅ Estadísticas en tiempo real
- ✅ Galería de instalaciones
- ✅ Múltiples métodos de pago

## 🚀 Inicio Rápido

### Requisitos
- Node.js 14+ 
- npm o yarn

### Instalación Local

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/gimnasio-fitlife.git
cd gimnasio-fitlife

# 2. Instala dependencias
cd backend
npm install

# 3. Inicia el servidor
npm start
```

✅ Abre http://localhost:3001 en tu navegador

## 📦 Despliegue (Deploy)

### 🎯 Opción 1: Netlify (Más Fácil)

1. **Sube a GitHub:**
   ```bash
   # Ejecuta el script
   ./deploy.sh  # Linux/Mac
   deploy.bat   # Windows
   ```

2. **Configura Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Selecciona tu repositorio
   - Configura:
     - Build command: *(vacío)*
     - Publish directory: `./`
   - Click "Deploy"

3. **¡Listo!** Te dan un dominio gratis como `tu-sitio.netlify.app`

### ⚡ Opción 2: Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Import from GitHub
3. Deploy automático
4. domain gratuito incluido

### 🖥️ Opción 3: Hosting Propio (Node.js)

```bash
# En tu servidor
git clone tu-repo
cd gimnasio-fitlife/backend
npm install
npm start
```

Configura Nginx como reverse proxy al puerto 3001.

## 📁 Estructura del Proyecto

```
gimnasio-fitlife/
├── i.html                 # Página principal
├── README.md              # Este archivo
├── deploy.bat            # Script deploy (Windows)
├── deploy.sh             # Script deploy (Linux/Mac)
├── .gitignore           # Archivos ignorados por Git
├── frontend/
│   ├── css/
│   │   └── styles.css   # Estilos completos
│   ├── js/
│   │   └── main.js      # JavaScript frontend
│   └── Imagenes/        # Imágenes del sitio
└── backend/
    ├── server.js        # Servidor Express
    ├── db.js            # Configuración SQLite
    ├── package.json     # Dependencias Node
    ├── models/          # Modelos de datos
    │   ├── users.js
    │   ├── plans.js
    │   ├── resenas.js
    │   └── ...
    └── routes/          # Rutas API
        ├── users.js
        ├── plans.js
        └── ...
```

## 🔧 Configuración

### Variables de Entorno (opcional)

Crea un archivo `.env` en `backend/`:

```env
PORT=3001
DB_PATH=./data/gimnasio.sqlite
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Node.js, Express.js
- **Base de datos**: SQLite (embebida)
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins)

## 📱 Compatibilidad

- Chrome / Firefox / Edge
- Safari
- Responsive design (320px - 4K)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - feel free to use this project for any purpose.

---

¿Necesitas ayuda? Crea un issue en GitHub o contacta al desarrollador.
