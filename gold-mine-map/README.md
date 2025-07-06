# 🏔️ Gold Mine Map - Global Mineral Tracking

A comprehensive Next.js application for tracking mineral mines across the world with user authentication, database storage, and mobile-responsive design.

## ✨ Features

- **Interactive Global Map**: Real-time mine locations with Leaflet.js
- **User Authentication**: Secure login/signup with NextAuth.js
- **Database Storage**: PostgreSQL with Prisma ORM
- **Mobile-First Design**: Responsive interface for all devices
- **Mine Management**: Add, view, and filter mines by type
- **Real-time Statistics**: Dynamic dashboard with mine counts
- **User Contributions**: Users can add their own mine data

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js, React-Leaflet
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pczupil/gold-mine-map.git
   cd gold-mine-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/gold_mine_map"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Seed Data

The application comes with comprehensive seed data including **20+ major mines** from around the world:

### **Gold Mines (5)**
- **Carlin Gold Mine** (USA) - 1.2M oz/year
- **Grasberg Mine** (Indonesia) - 2.5M oz/year  
- **Muruntau Gold Mine** (Uzbekistan) - 2.8M oz/year
- **Olimpiada Gold Mine** (Russia) - 1.2M oz/year
- **Boddington Gold Mine** (Australia) - 700K oz/year

### **Copper Mines (4)**
- **Escondida** (Chile) - 1.2M tons/year
- **Collahuasi** (Chile) - 500K tons/year
- **Oyu Tolgoi** (Mongolia) - 500K tons/year
- **Olympic Dam** (Australia) - 200K tons/year

### **Mixed Mineral Mines (3)**
- **Olympic Dam** (Australia) - Multi-commodity
- **Grasberg** (Indonesia) - Copper & Gold
- **Oyu Tolgoi** (Mongolia) - Copper & Gold

### **Iron Ore Mines (3)**
- **Carajás Mine** (Brazil) - 150M tons/year
- **Pilbara Operations** (Australia) - 300M tons/year
- **Mount Whaleback** (Australia) - 80M tons/year

### **Diamond Mines (3)**
- **Jwaneng Mine** (Botswana) - 15M carats/year
- **Orapa Mine** (Botswana) - 20M carats/year
- **Catoca Mine** (Angola) - 7M carats/year

### **Seed Data Features**
- ✅ **Real coordinates** for all mines
- ✅ **Production data** and descriptions
- ✅ **Company websites** and operator information
- ✅ **Regional classifications** by country/state
- ✅ **Multiple mineral types** (Gold, Copper, Iron, Diamond)
- ✅ **Admin user account** (email: admin@goldminemap.com, password: admin123)

### **Running the Seed**
```bash
# Seed the database with all mine data
npx prisma db seed

# Or reset and seed (clears all data first)
npx prisma migrate reset
```

## 🗄️ Database Schema

The application uses the following main models:

### Users
- Authentication and user management
- Can add and manage their own mines

### Mines
- Location data (latitude, longitude)
- Mine type and production information
- Status tracking (Active, Inactive, Planned)
- User attribution

### Mine Details
- Detailed mineral information
- Production data and reserves
- Historical data tracking

## 🔐 Authentication

The app uses NextAuth.js with credentials provider:

- **Sign Up**: `/auth/signup` - Create new account
- **Sign In**: `/auth/signin` - Login to existing account
- **Protected Routes**: Main dashboard requires authentication

### **Default Admin Account**
- **Email**: admin@goldminemap.com
- **Password**: admin123

## 📱 Mobile Features

- Responsive design that works on all screen sizes
- Touch-optimized map interactions
- Mobile navigation with bottom tab bar
- Optimized loading states

## 🗺️ Map Features

- Interactive global map with OpenStreetMap tiles
- Color-coded markers by mineral type
- Clickable popups with detailed mine information
- Real-time data from database

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database GUI
- `npx prisma db seed` - Seed database with mine data

### Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database with mine data
npx prisma db seed
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Mines
- `GET /api/mines` - Get all mines (with optional filters)
- `POST /api/mines` - Create new mine (authenticated)
- `GET /api/mines/[id]` - Get specific mine
- `PUT /api/mines/[id]` - Update mine (authenticated)
- `DELETE /api/mines/[id]` - Delete mine (authenticated)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the type-safe database toolkit
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Leaflet](https://leafletjs.com/) for interactive maps
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy mining! 🏔️✨**
