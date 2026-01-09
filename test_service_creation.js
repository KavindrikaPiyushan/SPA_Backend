import { createService } from './src/controller/service.controller.js';
import db from './src/config/db.js';

// Mock Response object
const res = {
  status: function(code) {
    console.log(`Response Status: ${code}`);
    return this;
  },
  json: function(data) {
    console.log('Response Data:', JSON.stringify(data, null, 2));
  }
};

// Mock Request object
const req = {
  body: {
    name: "Test Service with Media",
    duration: 60,
    description: "A service with media verification",
    aid: 1, // Assuming admin with ID 1 exists, if not constraint might fail but we'll see DB error
    media: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        public_id: "sample",
        resource_type: "image"
      }
    ]
  }
};

console.log("Testing createService...");
createService(req, res);

// Keep alive briefly for async DB
setTimeout(() => {
    // We don't want to hang forever, but db.query is async. 
    // The controller response should print.
    // If we want to verify DB content:
    db.query('SELECT * FROM Service WHERE name = ?', [req.body.name], (err, rows) => {
        if(err) console.error(err);
        else {
            console.log("DB Verification:", rows);
            // Clean up
            if(rows.length > 0) {
                db.query('DELETE FROM Service WHERE sid = ?', [rows[0].sid], () => process.exit());
            } else {
                process.exit();
            }
        }
    });
}, 2000);
