# prescriptions-app

## Requisitos
- Node.js 18+
- Docker y Docker Compose
- npm

## Instalación rápida

1. Clona el repositorio
\`\`\`bash
git clone https://github.com/chechojgb/prescriptions-app.git
cd prescriptions-app
\`\`\`

2. Copia las variables de entorno
\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

3. Instala dependencias
\`\`\`bash
make install
\`\`\`

4. Levanta la base de datos, corre migraciones y seed
\`\`\`bash
make setup
\`\`\`

5. Levanta el proyecto
\`\`\`bash
make dev
\`\`\`

## URLs locales
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Swagger: http://localhost:3001/docs
- Prisma Studio: http://localhost:5555

## Cuentas de prueba
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@test.com | admin123 |
| Médico | dr@test.com | dr123 |
| Paciente | patient@test.com | patient123 |