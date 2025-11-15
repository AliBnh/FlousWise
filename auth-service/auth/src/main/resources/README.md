# Configuration Setup

## application.properties

The `application.properties` file is required to run the application but is not tracked by git for security reasons.

### Setup Instructions:

1. Copy the example file:
   ```bash
   cp application.properties.example application.properties
   ```

2. Update the values in `application.properties` as needed for your environment.

### Important Configuration Notes:

- **JWT Secret**: Must be at least 256 bits (32 characters) for the HS256 algorithm
  - Generate a secure secret: `openssl rand -base64 32`
  - Update `app.jwt.secret` with the generated value

- **MongoDB**: Configure your MongoDB connection settings
  - Update host, port, database name, username, and password as needed
