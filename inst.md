\# VelDB — Team Work Plan (Confidential)



\*\*Project:\*\* VelDB — Smart Database Platform  

\*\*Team Size:\*\* 7 Members  

\*\*Duration:\*\* 4 Weeks (Phase 1 → Phase 2)  

\*\*Tech Stack:\*\* Rust + Python + React + Node.js  

\*\*GitHub:\*\* https://github.com/simphx5/VelDB  



\---



\## 👥 Team Overview



| No | Name            | Role                          | Branch                | Folder Ownership                          |

|----|-----------------|-------------------------------|-----------------------|-------------------------------------------|

| 1  | Sunil           | DB Core Engineer              | sunil-db-engine       | /core/storage, /core/query\_engine         |

| 2  | Divya           | Backend Developer             | divya-backend         | /api, /api/query                          |

| 3  | Muthu           | DevOps / Admin                | muthu-devops          | /devops, /.github/workflows               |

| 4  | Thamarai        | UI/UX Designer                | thamarai-uiux         | /docs                                     |

| 5  | Muthu Alagan    | Frontend Developer            | muthualagan-frontend  | /ui/web, /ui/components                   |

| 6  | Harini          | Frontend Developer (SQL Editor)| harini-ui            | /ui/components                            |

| 7  | Logendran       | AI / ML Engineer              | logendran-ai          | /ai/nl\_to\_sql                             |



\---



\# 🧠 Sunil — DB Core Engineer



\## Week 1 \[Completed]

\*\*Goal:\*\* Study DB engine + design storage



\### Tasks:

\- Study PostgreSQL \& SQLite structure

\- Design `.vdb` file format

\- Create core folders

\- Write storage\_design.md

\- Create skeleton files



\### Deliverables:

\- storage\_design.md  

\- table\_manager.rs  

\- parser.rs  

\- executor.rs  



\---



\## Week 2 \[In Progress]

\*\*Goal:\*\* INSERT + SELECT + WHERE + indexing



\### Tasks:

\- Implement INSERT

\- Implement SELECT (all + columns)

\- Add WHERE clause

\- Build HashMap index

\- Write test queries



\### Deliverables:

\- executor.rs  

\- index\_manager.rs  

\- tests/test\_queries.md  



\---



\## Week 3 \[Upcoming]

\*\*Goal:\*\* UPDATE, DELETE, JOIN



\### Tasks:

\- UPDATE, DELETE

\- INNER JOIN

\- ORDER BY, LIMIT

\- Query optimizer

\- WAL design



\### Deliverables:

\- join\_engine.rs  

\- optimizer.rs  

\- wal\_design.md  



\---



\## Week 4 \[Upcoming]

\*\*Goal:\*\* Transactions + concurrency



\### Tasks:

\- BEGIN / COMMIT / ROLLBACK

\- Row-level locking

\- Backup + restore

\- Stress test



\### Deliverables:

\- transaction\_manager.rs  

\- lock\_manager.rs  

\- backup.rs  



\---



\# ⚙️ Divya — Backend Developer



\## Week 1 \[Completed]

\*\*Goal:\*\* Node.js API setup



\### Tasks:

\- Setup Express server

\- Create routes

\- Write README



\### Deliverables:

\- server.js  

\- app.js  

\- routes.js  



\---



\## Week 2 \[In Progress]

\*\*Goal:\*\* Connect Rust engine



\### Tasks:

\- API service layer

\- Connect CLI via child\_process

\- JSON response handling



\### Deliverables:

\- db\_bridge.js  

\- routes/query.js  



\---



\## Week 3 \[Upcoming]

\*\*Goal:\*\* Authentication



\### Tasks:

\- JWT login

\- Middleware

\- Roles (admin/editor/viewer)



\### Deliverables:

\- auth.js  

\- middleware/auth.js  



\---



\## Week 4 \[Upcoming]

\*\*Goal:\*\* Jobs + export + rate limit



\### Tasks:

\- Job queue

\- Export API

\- Logging + monitoring



\### Deliverables:

\- queryJob.js  

\- api\_docs.md  



\---



\# 🚀 Muthu — DevOps / Admin



\## Week 1 \[Completed]

\*\*Goal:\*\* Environment setup



\### Tasks:

\- Install tools

\- Dockerfile draft

\- GitHub Actions



\### Deliverables:

\- Dockerfile  

\- docker-compose.yml  

\- ci.yml  



\---



\## Week 2 \[In Progress]

\*\*Goal:\*\* CI/CD pipeline



\### Tasks:

\- Final Docker setup

\- GitHub Actions CI

\- Onboarding guide



\### Deliverables:

\- onboarding\_guide.md  



\---



\## Week 3 \[Upcoming]

\*\*Goal:\*\* Staging + deployment



\### Tasks:

\- Staging server

\- Auto deploy

\- Secrets

\- Nginx + SSL



\### Deliverables:

\- deploy.yml  

\- nginx.conf  

\- runbook.md  



\---



\## Week 4 \[Upcoming]

\*\*Goal:\*\* Monitoring + backup



\### Tasks:

\- Prometheus + Grafana

\- Log aggregation

\- Backup automation

\- Alerts



\### Deliverables:

\- prometheus.yml  

\- grafana\_dashboard.json  

\- backup\_cron.sh  



\---



\# 🎨 Thamarai — UI/UX Designer



\## Week 1 \[Completed]

\- Login + dashboard wireframes  

\- SQL editor UI  



\## Week 2 \[In Progress]

\- Import/export design  

\- Color system  

\- Component guide  



\## Week 3 \[Upcoming]

\- Domain dashboards  

\- Mobile UI  



\## Week 4 \[Upcoming]

\- Admin panel  

\- Pricing page  

\- Design system  



\---



\# 💻 Muthu Alagan — Frontend Developer



\## Week 1 \[Completed]

\- React app setup  

\- Sidebar + Navbar  



\## Week 2 \[In Progress]

\- API integration  

\- Table view  



\## Week 3 \[Upcoming]

\- Charts + analytics  

\- Theme system  



\## Week 4 \[Upcoming]

\- Import/export UI  

\- Schema browser  



\---



\# 🧩 Harini — SQL Editor



\## Week 1 \[Completed]

\- Editor skeleton  



\## Week 2 \[In Progress]

\- Syntax highlighting  

\- Query execution  



\## Week 3 \[Upcoming]

\- Schema sidebar  

\- Export results  



\## Week 4 \[Upcoming]

\- AI query input  

\- Accessibility  



\---



\# 🤖 Logendran — AI / ML Engineer



\## Week 1 \[Completed]

\- NL → SQL prototype  



\## Week 2 \[In Progress]

\- FastAPI endpoint  

\- Schema-aware queries  



\## Week 3 \[Upcoming]

\- Domain detection  

\- Chart suggestions  



\## Week 4 \[Upcoming]

\- Report generator  

\- Insights engine  

\- Accuracy tracking  



\---



\# 📌 Summary



VelDB is being built as a \*\*full-stack intelligent database platform\*\* with:



\- ⚡ Custom DB engine (Rust)

\- 🌐 API layer (Node.js)

\- 🎨 Frontend dashboard (React)

\- 🤖 AI-powered SQL generation (Python)

\- ☁️ DevOps automation (Docker + CI/CD)



\---

