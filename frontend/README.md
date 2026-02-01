# 🔗 Linkzzzz

> A unified personal content vault for links, notes, and visual memories

**Linkzzzz** is a lightweight, privacy-focused content management system that eliminates the chaos of scattered bookmarks, screenshots, and notes across multiple apps. Capture content instantly via browser extension, manage it beautifully on the web, and access it anywhere.

---

## ✨ Features

### 🚀 **Extension-First Design**
- **One-click save** from any webpage
- **Keyboard shortcuts** for instant capture
- **Zero friction** content collection

### 📱 **Cross-Platform Sync**
- Browser extension (Chrome, Firefox, Edge)
- Web application (desktop & mobile)
- Native Android app (coming soon)

### 🎯 **Smart Organization**
- Manual categorization (you control the structure)
- Timeline-based browsing
- Full-text search across all content
- Star your favorites

### 🖼️ **Visual Memory Cues**
- Save up to 10 images as memory triggers
- Automatic client-side image optimization
- Web-optimized storage

### 🔒 **Privacy & Security**
- **Your data, your eyes only** - strict per-user isolation
- Row-level security at the database level
- JWT-based authentication
- Mandatory email verification

---

## 🏗️ Architecture

```
┌─────────────────┐
│Browser Extension│
└────────┬────────┘
         │
         ├──────────────┐
         │              │
    ┌────▼─────┐   ┌────▼────┐
    │ Web App  │   │Android  │
    └────┬─────┘   └────┬────┘
         │              │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │  FastAPI     │
         │  Backend     │
         └──────┬───────┘
                │
      ┌─────────┴─────────┐
      │                   │
┌─────▼──────┐    ┌───────▼────────┐
│ PostgreSQL │    │ Object Storage │
└────────────┘    └────────────────┘
```

**Tech Stack:**
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Extension:** Chrome Extension Manifest V3
- **Mobile:** Kotlin (Android)
- **Storage:** S3-compatible object storage
- **Auth:** JWT, OAuth 2.0 (Google)

---

## 🚦 Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL 14+
- Node.js (for extension bundling, optional)
- AWS S3 or compatible storage

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/linkzzzz.git
cd linkzzzz
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your database and SMTP credentials

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

#### 3. Frontend Setup
```bash
cd frontend

# No build step needed! Just open in browser
# Or serve with:
python -m http.server 8000
```

#### 4. Browser Extension Setup
```bash
cd extension

# Chrome/Edge:
# 1. Open chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the 'extension' folder

# Firefox:
# 1. Open about:debugging#/runtime/this-firefox
# 2. Click "Load Temporary Add-on"
# 3. Select manifest.json from extension folder
```

---

## 📝 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/linkzzzz

# Security
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Email (for verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Storage
STORAGE_TYPE=s3  # or 'local' for development
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=linkzzzz-images
AWS_REGION=us-east-1

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:8000
```

---

## 📖 Usage

### Browser Extension

1. **Quick Save:** Click the extension icon or press `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac)
2. **Add Link:** Automatically captures current page URL and title
3. **Add Note:** Switch to text mode and type your note
4. **Choose Category:** Select from your categories
5. **Save:** Hit enter or click save

### Web Application

1. **Dashboard:** View all your saved content in one place
2. **Search:** Use the search bar to find anything instantly
3. **Categories:** Filter by category or view timeline
4. **Star Items:** Mark important content for quick access
5. **Upload Images:** Drag & drop or click to upload (max 10)

### Android App
*Coming soon*

---

## 🎯 Project Structure

```
linkzzzz/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── utils/       # Helpers
│   ├── alembic/         # Database migrations
│   └── tests/           # Backend tests
│
├── frontend/            # Web application
│   ├── css/
│   ├── js/
│   └── *.html
│
├── extension/           # Browser extension
│   ├── manifest.json
│   ├── popup.html
│   └── *.js
│
└── docs/               # Documentation
```

---

## 🛣️ Roadmap

### ✅ MVP (Current)
- [x] Email/password authentication
- [x] Browser extension (Chrome)
- [x] Web dashboard
- [x] Links, text notes, and images
- [x] Categories and search
- [x] 10-image limit

### 🚧 Phase 2
- [ ] Google OAuth integration
- [ ] Android mobile app
- [ ] Advanced search filters
- [ ] Export functionality (JSON)
- [ ] Keyboard shortcuts in web app

### 🔮 Future
- [ ] AI-powered auto-categorization
- [ ] Browser extension for Firefox/Safari
- [ ] Collaborative shared vaults
- [ ] Premium tier (increased limits)
- [ ] Dark mode
- [ ] Browser history integration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Soubhik Sadhu**

- GitHub: [@SoubhikSadhu](https://github.com/soubhlance)
- Email: soubhiksadhu1981@gmail.com

---

## 🙏 Acknowledgments

- Inspired by the fragmentation of personal content management
- Built with ❤️ and FastAPI
- Special thanks to the open-source community

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs)
2. Open an [issue](https://github.com/yourusername/linkzzzz/issues)
3. Email: support@linkzzzz.com

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with 🔗 by developers, for developers

</div>
