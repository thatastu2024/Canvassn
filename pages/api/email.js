export default function handler(req, res) {
    const emails = [
      { id: 1, subject: 'Welcome to our service', sender: 'admin@example.com' },
      { id: 2, subject: 'Your account has been updated', sender: 'support@example.com' },
      { id: 3, subject: 'New features added', sender: 'updates@example.com' },
      // Add more mock emails here
    ];
  
    res.status(200).json(emails);
  }
  