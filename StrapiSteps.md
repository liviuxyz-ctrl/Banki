## Step 1: Access the Strapi Admin Panel

1. **Run Your Strapi Instance:**  
   Make sure your Strapi server is running (usually on `http://localhost:1337/admin`).

2. **Log In:**  
   Log in to the admin panel using your administrator credentials.

---

## Step 2: Create a New Collection Type

1. **Navigate to Content-Type Builder:**  
   In the sidebar, click on **Content-Types Builder**.

2. **Create a New Collection Type:**  
   Click the **+ Create new collection type** button.

3. **Name the Collection Type:**  
   Enter a name like `Account` (or another name that suits your needs).

4. **Add Fields to the Collection Type:**
    - **IBAN Field:**
        - Click **Add another field**.
        - Select the **Text** type.
        - Set the Field Name to `IBAN`.
        - You may want to enable validation rules (e.g., required and maybe a regex pattern if you want to validate the IBAN format).

    - **Balance Field:**
        - Click **Add another field**.
        - Select the **Number** type.
        - Set the Field Name to `c`.
        - Choose whether you want integers or decimals (e.g., currency might require decimals).
        - Optionally set a default value (e.g., `0`).

5. **Save Your Collection Type:**  
   Once you’ve added the fields, click the **Save** button. Strapi will restart to apply the new configuration.

---

## Step 3: Seed or Manage Data

1. **Create Accounts:**  
   After the restart, navigate to the new `Accounts` section in the sidebar.  
   Click **Add New Account** and fill in the IBAN and balance fields for each account.  
   For example:
    - **IBAN:** `DE89370400440532013000`
    - **Balance:** `1500.00`

2. **Manage Data:**  
   You can add, update, or delete accounts through the admin panel, and the API endpoints will be automatically created for this collection type.

---

## Step 4: API Access

Strapi automatically generates RESTful endpoints for your collection types. For example, you can:

- **GET all accounts:**  
  `GET http://localhost:1337/api/accounts`

- **GET one account:**  
  `GET http://localhost:1337/api/accounts/:id`

- **POST a new account:**  
  `POST http://localhost:1337/api/accounts`

- **PUT (update) an account:**  
  `PUT http://localhost:1337/api/accounts/:id`

- **DELETE an account:**  
  `DELETE http://localhost:1337/api/accounts/:id`

You can use these endpoints in your front-end application to perform CRUD operations on accounts.

---

## Optional: Customizing Permissions

1. **Permissions:**  
   If you want public or authenticated users to have access to these endpoints, navigate to **Settings > Roles & Permissions** in the Strapi admin panel.

2. **Configure Role:**  
   For the relevant role (e.g., Public or Authenticated), adjust the permissions for the `Account` collection type as needed (e.g., find, findOne, create, update, delete).

---

## Summary

By following these steps, you create an "Account" collection type in Strapi that includes:
- An **IBAN** field (text) for storing account numbers.
- A **balance** field (number) for storing each account’s money.
