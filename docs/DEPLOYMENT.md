# ClipCommerce Deployment Guide

This guide covers deploying ClipCommerce to production environments.

## Prerequisites

- Node.js 18+ installed
- A Supabase project set up
- A Stripe account configured
- A Google Cloud Console project for YouTube API
- A domain name (optional but recommended)

## Environment Setup

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to Settings > Database to get your database URL
4. Enable Row Level Security (RLS) on all tables
5. Set up authentication providers if needed

### 2. Stripe Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key from the Dashboard
3. Get your secret key from the Dashboard
4. Set up webhooks for payment events
5. Configure Stripe Connect for marketplace functionality

### 3. YouTube API Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (OAuth 2.0 client ID)
5. Configure authorized redirect URIs

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# YouTube API
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/youtube/callback"

# App Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
NODE_ENV="production"
```

## Deployment Options

### Vercel (Recommended) - GitHub Integration

**Production deployment is automated through GitHub integration with Vercel:**

1. **Connect GitHub Repository to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the main branch for production deployments

2. **Configure Environment Variables:**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add all required production environment variables
   - Ensure variables are set for Production environment

3. **Automatic Deployment:**
   - Every push to the `main` branch automatically triggers a production deployment
   - Pull requests create preview deployments for testing
   - No manual deployment commands needed

4. **Monitoring and Management:**
   - Access Vercel environment through the Vercel MCP server
   - Monitor deployments, logs, and performance metrics
   - View build logs and deployment status
   - Manage environment variables and settings

### Docker

1. **Create a Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY . .
   COPY --from=deps /app/node_modules ./node_modules
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t clipcommerce .
   docker run -p 3000:3000 clipcommerce
   ```

### AWS EC2

1. **Launch an EC2 instance (Ubuntu 20.04 LTS)**
2. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Clone and build:**
   ```bash
   git clone https://github.com/yourusername/clipcommerce.git
   cd clipcommerce
   npm install
   npm run build
   ```

4. **Configure PM2:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "clipcommerce" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Migration

1. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

2. **Push schema to production:**
   ```bash
   npx prisma db push
   ```

3. **Seed initial data (optional):**
   ```bash
   npm run db:seed
   ```

## SSL Certificate

### Let's Encrypt (Free)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Monitoring and Logging

### Vercel Analytics

1. Enable Vercel Analytics in your dashboard
2. Add to your app:
   ```bash
   npm install @vercel/analytics
   ```

### Sentry (Error Tracking)

1. Create a Sentry account
2. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

3. Configure in `sentry.client.config.js`:
   ```javascript
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     tracesSampleRate: 1.0,
   });
   ```

## Performance Optimization

### Image Optimization

- Use Next.js Image component
- Implement lazy loading
- Optimize image formats (WebP, AVIF)

### Caching

- Implement Redis for session storage
- Use CDN for static assets
- Configure proper cache headers

### Database Optimization

- Add proper indexes
- Use connection pooling
- Monitor query performance

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Regular dependency updates

## Backup Strategy

### Database Backups

1. **Automated daily backups:**
   ```bash
   # Add to crontab
   0 2 * * * pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **Supabase backups:**
   - Enable point-in-time recovery
   - Set up automated backups

### File Backups

- Use cloud storage (AWS S3, Google Cloud Storage)
- Implement versioning
- Regular backup testing

## Troubleshooting

### Common Issues

1. **Build failures:**
   - Check Node.js version
   - Clear `.next` folder
   - Verify environment variables

2. **Database connection issues:**
   - Check connection string
   - Verify network access
   - Check SSL configuration

3. **Authentication issues:**
   - Verify Supabase configuration
   - Check redirect URLs
   - Validate JWT tokens

### Logs

- **Vercel:** 
  - Check function logs in Vercel dashboard
  - Use Vercel MCP server to access deployment logs programmatically
  - Monitor build logs and runtime logs through MCP integration
- **Docker:** `docker logs container-name`
- **PM2:** `pm2 logs clipcommerce`

## Scaling

### Horizontal Scaling

- Use load balancers
- Implement session storage (Redis)
- Database read replicas

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching layers

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor performance metrics
- [ ] Review security logs
- [ ] Backup verification
- [ ] SSL certificate renewal

### Updates

1. **Test in staging environment**
2. **Create database migrations**
3. **Deploy during low-traffic periods**
4. **Monitor for issues**
5. **Rollback plan ready**

## Vercel MCP Server Integration

### Accessing Vercel Environment

The project includes integration with Vercel's MCP (Model Context Protocol) server for programmatic access to:

- **Deployment Management:**
  - List all deployments and their status
  - Get deployment details and build logs
  - Monitor deployment progress in real-time
  - Access deployment URLs and metadata

- **Project Management:**
  - View project configuration and settings
  - Manage environment variables
  - Check team and organization details
  - Monitor project performance metrics

- **Logging and Monitoring:**
  - Access build logs for debugging
  - View function logs and runtime errors
  - Monitor performance and usage statistics
  - Track deployment history and changes

### Using Vercel MCP Server

The MCP server provides programmatic access to Vercel's platform, allowing for:
- Automated deployment monitoring
- Integration with development workflows
- Real-time status updates
- Centralized management of multiple projects

## Support

For deployment issues:
- Check the troubleshooting section
- Review logs for errors using Vercel MCP server
- Contact support team
- Create GitHub issue with details
