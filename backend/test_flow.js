const http = require('http');

async function runTest() {
  const fetch = (url, options) => new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });

  console.log('--- Testing Mock Login (Tutor) ---');
  let res = await fetch('http://localhost:5005/api/appointments/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Dr. John', email: 'john@example.com', role: 'tutor' })
  });
  console.log(res.data);
  const tutorId = res.data.user.id;

  console.log('--- Testing Create Session (Tutor) ---');
  res = await fetch('http://localhost:5005/api/appointments/sessions', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tutorId, subject: 'Database Systems', date: '2026-04-01', startTime: '10:00', endTime: '11:00', capacity: 2, meetingLink: 'http://meet' })
  });
  console.log(res.data);
  const sessionId = res.data.session.id;

  console.log('--- Testing Mock Login (Student) ---');
  res = await fetch('http://localhost:5005/api/appointments/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', role: 'student' })
  });
  console.log(res.data);
  const studentId = res.data.user.id;

  console.log('--- Testing Get Subjects ---');
  res = await fetch('http://localhost:5005/api/appointments/subjects?faculty=Computing&degree=Information%20Technology&year=Year%203&semester=Semester%202', { method: 'GET' });
  console.log(res.data);

  console.log('--- Testing Get Available Sessions ---');
  res = await fetch('http://localhost:5005/api/appointments/sessions?subject=Database%20Systems', { method: 'GET' });
  console.log(res.data);

  console.log('--- Testing Book Session ---');
  res = await fetch('http://localhost:5005/api/appointments/bookings', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, studentId })
  });
  console.log(res.data);

  console.log('--- Testing Get Student Bookings ---');
  res = await fetch(`http://localhost:5005/api/appointments/bookings/student/${studentId}`, { method: 'GET' });
  console.log(JSON.stringify(res.data, null, 2));
}

runTest().catch(console.error);
