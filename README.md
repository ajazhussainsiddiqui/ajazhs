# The Vibe-Coded Portfolio 

This isn't a standard hard-coded portfolio template. I built this project because I wanted a website that feels alive—where I can design, write, and restructure content in **real-time**, without touching a line of code (in codebase) after deploy.

I "vibe coded" this. I leveraged AI and intuition to build a system that prioritizes **creative freedom** over rigid structure. It was built out of curiosity: *Could I make a portfolio where the Edit Mode is just the Live Site with full freedom?*


Most CMS forces you to fill out forms in a boring admin panel, then hit "Preview" to see if it looks good.


In this project, if you are logged in (via Supabase Auth), the page you are looking at becomes editable.
* Want to change the text/style ? **Click and type.**
* Want a 3-column layout? **Convert it by one click.**
* Want to move a section up? **Push it up.**
* **Everything saves to Firebase instantly.**

## Amazing features

### 1. Block-Based Creativity
The site is built on a dynamic block system. I can stack blocks endlessly to create unique layouts.
* **Rich Text Blocks:** Supports full **Markdown** and **HTML**. I can write, embed `<iframe>`s, or drop in custom snippets.
* **Spacer Blocks:** Pixel-perfect control over vertical rhythm.

### 2. Styling with Tailwind
Every block has a **Custom Styles** input. I can paste raw Tailwind CSS classes directly into the block to style it in real-time.
Like
* *Neon Glow* `shadow-[0_0_25px_rgba(20,184,166,0.3)]`
* *interactive* `hover:scale-[1.05] transition-all duration-300`

Here a card can redesign from "Minimalist" to "Cyberpunk" in seconds, directly from the browser.

### 3. Fluid Layout Engine
* **Multi-Column Support:** I can split any section into 1 to 6 columns.
* **Live Resizing:** I added sliders to adjust column widths in real-time.
* **Drag & Drop:** I can move blocks Up, Down, Left, or Right. The grid adapts to me.
* **Multi-blocks layout:** Here blocks can be arranged into masonry or grid layout too.

### 4. Dynamic Page Management
* **Infinite Pages:** I can create new pages as "Section" .
* **Navigation Control:** Pages can be reordered, renamed, hide, and added to the header navigation.
* **Header Blocks:** Even the header is dynamic—I can add text blocks there for announcements or branding.

### 5. Built-in messanging 
I built an messanging feature right into the header. Visitors send messages, and I get real-time toast notifications or I can see it later from bottom managing section.

---

## The Tech Stack
* **Framework:** [Next.js](https://nextjs.org/)
* **Database:** [Firebase Firestore](https://firebase.google.com/) (Real-time updates)
* **Authentication:** [Supabase](https://supabase.com/) (Secure, simple login)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Deployment:** [Vercel](https://vercel.com/)


This portfolio is a living thing. It changes when I change.  
Thanks for stopping by 🤍

---
*Built with curiosity and a lot of LLM prompting.*
