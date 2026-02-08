.PHONY: up down logs shell

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

shell:
	docker compose exec frontend sh
