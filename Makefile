.PHONY: up down logs shell

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec frontend sh

# RESET complet du projet front
reset:
	docker compose down
	rm -rf node_modules package-lock.json dist
	docker compose build --no-cache frontend
	docker compose up -d frontend