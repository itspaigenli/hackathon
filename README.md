## Zombie Survival API
### Project Description
The Zombie Survival API is a RESTful backend service designed to manage resources in a fictional zombie survival scenario. The API allows users to manage survivors, safehouses, and supplies stored in a PostgreSQL database.

The goal of this project is to design and implement a clean, well-documented API that other developers can easily understand and integrate into their applications without needing to read the backend implementation.

The API can be used by zombie game websites, mobile apps, or other services to track survivors, manage safehouses, and organize supplies in a survival environment.

### API Endpoint Documentation
Swagger UI documentation is available at:
`http://localhost:3000/docs`
This interactive documentation allows developers to explore endpoints, test API requests, and view response schemas.

### API Overview
***Safehouses***
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| GET | `/api/safehouses` | Get all safehouse | 200 |
| GET | `/api/safehouses/{id}` | Get one safehouse by ID | 200 |
| GET | `/api/safehouses/{id}/survivors` | Get survivors in a safehouse | 200 |
| GET | `/api/safehouses/{id}/supplies` | Get supplies in a safehouse | 200 |

***Examples***
<img width="1191" height="636" alt="Screenshot 2026-03-08 at 3 56 56 PM" src="https://github.com/user-attachments/assets/e1559727-7c81-4477-b838-716a1eacde2c" />

<img width="1180" height="498" alt="Screenshot 2026-03-08 at 4 07 11 PM" src="https://github.com/user-attachments/assets/37b34765-2338-46b0-8d21-464f29a38915" />

***Supplies***
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| GET | `/api/supplies` | Get all supplies | 200 |
| POST | `/api/supplies` | Create a new supply | 201 |
| PUT | `/api/supplies/{id}` | Update supplies by ID | 200 |
| DELETE | `/api/supplies/{id}` | Delete supplies by ID | 200 |

***Examples***
<img width="1174" height="376" alt="Screenshot 2026-03-08 at 4 08 02 PM" src="https://github.com/user-attachments/assets/fe928f1b-9835-48ff-908c-a95e44d2c0cf" />

***Survivors***
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| GET | `/api/survivors` | Get all survivors| 200 |
| GET | `/api/survivors/{id}` | Get one survivor by ID | 200 |
| POST | `/api/survivors` | Create a new survivor | 201 |
| PUT | `/api/survivors/{id}` | Update survivor by ID | 200 |
| DELETE | `/api/survivors/{id}` | Delete survivor by ID | 200 |

***Examples***
<img width="1165" height="395" alt="Screenshot 2026-03-08 at 4 08 34 PM" src="https://github.com/user-attachments/assets/aaaf8a37-5027-4552-9747-9592b7e43f0d" />
<img width="1179" height="358" alt="Screenshot 2026-03-08 at 4 08 56 PM" src="https://github.com/user-attachments/assets/bf8a5485-9f86-4415-b56f-fb6e056722e5" />


***Filtering Survivors***

The API supports filtering survivors using query parameters.
- `GET /api/survivors?health_status=healthy`
- `GET /api/survivors?skill=medic`
- `GET /api/survivors?safehouse_id=1`
- `GET /api/survivors?health_status=healthy&skill=medic`
- `GET /api/survivors?health_status=healthy&skill=medic&safehouse_id=1`

***Examples***
<img width="1189" height="480" alt="Screenshot 2026-03-08 at 4 09 26 PM" src="https://github.com/user-attachments/assets/c23520de-6b97-4b74-a748-f65d5b373f57" />

### AI Tools Used
- ChatGPT: To seed data

### Team Member Contributions
1. Paige – Safehouses API & Frontend Implementation
   - Designed and implemented the `safehouses` table
   - Built CRUD operations for safehouses
   - Added Swagger/OpenAPI documentation for `safehouses`
   - Developed the frontend dashboard using React and Vite
   - Integrated frontend components with backend API endpoints
   - Implemented data fetching and UI display for safehouses, survivors, and supplies
2. Dari – Supplies API
  - Designed and implemented the `supplies` table
  - Built CRUD operations for supplies
  - Added Swagger/OpenAPI documentation for `supplies`
  - Implemented Swagger/OpenAPI documentation setups
3. Siyi – Survivors API
   - Designed and implemented the `survivors` table
   - Built CRUD operations for survivors
   - Added filtering support by `health_status`, `skill`, and `safehouse_id`
   - Added request validation and error handling for survivor-related endpoints
   - Built nested endpoints for retrieving survivors and supplies within `safehouse` table
   - Added Swagger/OpenAPI documentation for `survivors` and documentation for nested endpoints part in `safehouse`
   - Contributed to README writing

All team members collaborated on API design decisions, database integration, endpoint testing, and overall project refinement.

### How to test
1. Clone [hackathon repo](https://github.com/itspaigenli/hackathon.git)
2. Run `cd server` command to change to server directory
3. Run `npm install` command to install all latest dependencies
4. Edit example `.env` file and add `DATABASE_URL` link
5. Run `npm run dev` command
6. Open `http://localhost:3000/api/db-test` in browser to see backend server running and db connection
  <img width="576" height="260" alt="image" src="https://github.com/user-attachments/assets/b01f9726-c837-448a-b4dc-aa0fa13b4165" />
  
7. Run `cd .. && cd client` command to change to client directory
8. Run `npm install` command to install all latest dependencies
9. Edit example `.env` file and add `VITE_API_URL` link
10. Run `npm run` dev command
11. Open `http://localhost:5174/` in browser to see frontend server running and db connection
![Untitleddesign-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/289b0554-2d25-4e8d-ab5e-89a3bc8fe5a2)

