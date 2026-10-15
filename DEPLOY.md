# Deploy Your Site — 2 Minutes

## Step 1: Deploy to Netlify (drag-and-drop)
1. Open https://app.netlify.com/drop in your browser
2. Drag the folder `~/projects/vijay-website` onto the page
3. You get a free URL like `https://your-site-123.netlify.app`

## Step 2: Point your GoDaddy domain
1. Log into GoDaddy
2. Go to My Products → your domain → DNS
3. Add an A record:
   - Type: A
   - Name: @
   - Value: 75.2.60.5
   - TTL: 1 hour
4. Add a CNAME record:
   - Type: CNAME
   - Name: www
   - Value: your-site-123.netlify.app (your actual Netlify URL)
   - TTL: 1 hour

## Step 3: Wait
DNS changes take 5–60 minutes. Then your domain shows your site.

## No sudo needed — this is the safe, fast way.
