## Project Structure
cybersecurity-platform/
├── app/
│   ├── layout.jsx                 # Root layout with providers
│   ├── page.jsx                   # Login page (default route)
│   ├── dashboard/
│   │   ├── layout.jsx             # Dashboard layout with idebar
│   │   ├── page.jsx               # Main dashboard overview
│   │   ├── threats/page.jsx       # Threat hunting interface
│   │   ├── config/page.jsx        # Configuration management
│   │   ├── vulnerabilities/page.jsx # Vulnerability analysis
│   │   └── reports/page.jsx       # Reports center
│   └── globals.css                # Tailwind imports + custom styles
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── charts/                    # Chart components
│   ├── auth/                      # Authentication components
│   └── dashboard/                 # Dashboard-specific components
├── lib/
│   ├── mock-data.js              # All mock data
│   ├── utils.js                  # Utility functions
│   └── context/                  # React Context providers
├── public/
│   └── assets/                   # Images and static files
└── tailwind.config.js            # Tailwind configuration