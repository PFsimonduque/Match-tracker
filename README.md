# AN Match Tracker
### PF Simón Duque Villegas — Atlético Nacional

App para seguimiento de partidos en vivo. Optimizada para iPad Air 11.

---

## 🚀 Deploy en Vercel (5 minutos)

### Paso 1 — Subir a GitHub
1. Ir a **github.com** → New repository
2. Nombre: `match-tracker`
3. Privado o público (como prefieras)
4. **NO** inicializar con README
5. Copiar la URL del repo (ej: `https://github.com/tuusuario/match-tracker`)

### Paso 2 — Subir los archivos
Desde la terminal (Mac/PC):
```bash
cd match-tracker
git init
git add .
git commit -m "Match tracker AN"
git remote add origin https://github.com/TUUSUARIO/match-tracker.git
git push -u origin main
```

O arrastrá la carpeta directamente a GitHub desde el navegador.

### Paso 3 — Deploy en Vercel
1. Ir a **vercel.com** → Sign up con tu cuenta de GitHub
2. Click **"Add New Project"**
3. Seleccionar el repo `match-tracker`
4. Vercel detecta Vite automáticamente
5. Click **Deploy** → listo en ~1 minuto

### Paso 4 — Agregar al iPad como app
1. Abrir Safari en el iPad
2. Entrar a la URL de Vercel (ej: `match-tracker.vercel.app`)
3. Tocar el ícono de **Compartir** (cuadrado con flecha)
4. **"Agregar a pantalla de inicio"**
5. Se instala como una app nativa ✓

---

## 📱 Uso
- **Setup**: completar datos del partido antes de empezar
- **En vivo**: botonera para registrar eventos, cronómetro integrado
- **Informe**: se genera automáticamente, usar "Guardar PDF" para imprimir/compartir
- **Historial**: últimos 20 partidos guardados localmente en el navegador
