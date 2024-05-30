# Bidding Platform API

## Setup Instructions

1. Clone the repository
    ```sh
    git clone https://github.com/samirdhoran2000/bidding-platform.git
    cd bidding-platform
    ```

2. Install dependencies
    ```sh
    npm install
    ```

3. Setup environment variables
    ```sh
    cp .env.example .env
    # Update .env with your database and JWT settings
    ```

4. Run migrations
    ```sh
    npx sequelize-cli db:migrate
    ```

5. Start the server
    ```sh
    npm run dev
    ```

## API Endpoints

### Users
- `POST /users/register` - Register a new user.
- `POST /users/login` - Authenticate a user and return a token.
- `GET /users/profile` - Get the profile of the logged-in user.

### Items
- `GET /items` - Retrieve all auction items (with pagination).
- `GET /items/:id` - Retrieve a single auction item by ID.
- `POST /items` - Create a new auction item. (Authenticated users, image upload)
- `PUT /items/:id` - Update an auction item by ID. (Authenticated users, only item owners or admins)
- `DELETE /items/:id` - Delete an auction item by ID. (Authenticated users, only item owners or admins)

### Bids
- `GET /items/:itemId/bids` - Retrieve all bids for a specific item.
- `POST /items/:itemId/bids` - Place a new bid on a specific item. (Authenticated users)

### Notifications
- `GET /notifications` - Retrieve notifications for the logged-in user.
- `POST /notifications/mark-read` - Mark notifications as read.

## WebSocket Events
### Bidding
- `connection` - Establish a new WebSocket connection.
- `bid` - Place a new bid on an item.
- `update` - Notify all connected clients about a new bid on an item.

### Notifications
- `notify` - Send notifications to users in real-time.
