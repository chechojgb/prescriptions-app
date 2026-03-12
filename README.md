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
| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| Swagger UI | http://localhost:3001/docs |
| Prisma Studio | npx prisma studio |

## URLs producción
| Servicio | URL |
|----------|-----|
| Frontend | https://prescriptions-app-ruddy.vercel.app |
| Backend | https://prescriptions-app-production-aa8c.up.railway.app |
| Swagger UI | https://prescriptions-app-production-aa8c.up.railway.app/docs |

## Importar colección en Postman o Insomnia
1. Abre Postman o Insomnia
2. Click en **Import**
3. Pega esta URL:
\`\`\`
https://prescriptions-app-production-aa8c.up.railway.app/docs-json
\`\`\`
4. Click en **Import** — todos los endpoints quedarán listos

## Cuentas de prueba
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@test.com | admin123 |
| Médico | dr@test.com | dr123 |
| Paciente | patient@test.com | patient123 |


## Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS v4, Zustand
- **Backend:** NestJS, Prisma 7, PostgreSQL
- **Base de datos:** Neon (producción), Docker PostgreSQL (local)
- **Deploy:** Vercel (frontend), Railway (backend)