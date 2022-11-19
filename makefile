all:
	docker compose up -d
	clear
	npx prisma migrate dev
	npx prisma db seed
	npm run dev
