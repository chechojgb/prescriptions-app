.PHONY: install setup seed dev stop

install:
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "backend/.env creado — edítalo con tus credenciales"; \
	fi
	cd backend && npm install
	cd frontend && npm install

setup:
	docker-compose up -d
	sleep 3
	cd backend && npx prisma migrate deploy
	cd backend && npx prisma db seed

seed:
	cd backend && npx prisma db seed

dev:
	docker-compose up -d
	cd backend && npm run start:dev & cd frontend && npm run dev

stop:
	docker-compose down