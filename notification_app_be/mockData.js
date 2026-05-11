const now  = Date.now();
const mins = (m) => new Date(now - m * 60_000).toISOString();

const MOCK_NOTIFICATIONS = [
  { id: "n1",  type: "placement", title: "Google On-Campus Drive",      body: "Register by Friday.",              timestamp: mins(5)   },
  { id: "n2",  type: "result",    title: "Mid-Sem Results Published",    body: "Check your student portal.",       timestamp: mins(30)  },
  { id: "n3",  type: "event",     title: "Tech Fest 2026",               body: "Registrations open. Last: May 20.",timestamp: mins(120) },
  { id: "n4",  type: "placement", title: "Microsoft Internship Drive",   body: "Apply before Sunday.",             timestamp: mins(10)  },
  { id: "n5",  type: "result",    title: "Lab Evaluation Grades Out",    body: "View on LMS.",                     timestamp: mins(45)  },
  { id: "n6",  type: "event",     title: "Guest Lecture: AI & Society",  body: "Hall A, 3 PM tomorrow.",           timestamp: mins(200) },
  { id: "n7",  type: "placement", title: "Infosys Recruitment Notice",   body: "Eligibility: 6.5 CGPA.",           timestamp: mins(60)  },
  { id: "n8",  type: "result",    title: "Project Submission Evaluated", body: "Scores updated.",                  timestamp: mins(15)  },
  { id: "n9",  type: "event",     title: "Annual Sports Day",            body: "Signup closes tonight.",           timestamp: mins(90)  },
  { id: "n10", type: "placement", title: "Amazon SDE Hiring",            body: "Shortlisting starts Monday.",      timestamp: mins(3)   },
  { id: "n11", type: "result",    title: "Quiz 3 Results",               body: "Class average: 74%.",              timestamp: mins(25)  },
  { id: "n12", type: "event",     title: "Cultural Night",               body: "Entry free with ID card.",         timestamp: mins(300) },
];

module.exports = MOCK_NOTIFICATIONS;