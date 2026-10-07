# SpamShield AI

Full-stack spam email classifier using Java Spring Boot + Naive Bayes + HTML/CSS/JS.

## Run
1. Open terminal in `backend`
2. Run `mvn clean spring-boot:run`
3. Open `frontend/index.html` with VS Code Live Server.
4. Test a spam and normal email.

API: `POST http://localhost:8080/api/predict`
Health: `GET http://localhost:8080/api/health`

Replace `backend/src/main/resources/spam.csv` with your real dataset using columns `label,text`.