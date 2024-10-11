# Mail API

A simple Web API for sending emails. Users can send emails with a custom subject, text, and optional sender's name and email.

## Hosted URL
The API is hosted on [Render](https://render.com):
- Base URL: `https://mail-api-v1.onrender.com`

## Endpoints

### 1. Send Email
**URL:** `/api/email/send`  
**Method:** `POST`  
This endpoint allows you to send an email to a recipient with specified subject and text.

#### Request Headers
- `Content-Type: application/json`

#### Request Body Parameters
| Parameter        | Type     | Required | Description                                  |
|------------------|----------|----------|----------------------------------------------|
| `recipient`      | `string` | Yes      | Email address of the recipient               |
| `subject`        | `string` | Yes      | Subject of the email                         |
| `text`           | `string` | Yes      | Text content of the email                    |
| `from_name` | `string` | No       | Custom sender's name (default: "No-Reply")   |
| `from_mail`| `string` | No       | Custom sender's email address                |

#### Example Request


```javascript
fetch('https://mail-api-v1.onrender.com/api/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: "recipientemail@example.com",
    subject: "Test Email",
    text: "This is a test email.",
    from_name: "John Doe",
    from_mail: "johndoe@example.com"
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

```
