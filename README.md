# ZKP KYC Hackathon Demo

![Pixel Art Banner](public/default-avatar.png)

## 🚀 Zero-Knowledge Proof (ZKP) KYC Demo

A privacy-first, pixel-art themed KYC web app using Node.js, Express, Auth0, MongoDB Atlas, and EJS. Prove your age or identity **without revealing your sensitive data**—and see real-world ZKP concepts in action!

---

## ✨ Features
- **Zero-Knowledge Proof (ZKP) Simulation:** Prove you're over 18 without sharing your birthdate.
- **Passwordless Login Animation:** See how ZKPs power modern authentication.
- **Pixel-art UI:** Fun, retro, and hackathon-friendly.
- **Local Avatars:** No external avatar leaks—choose your own!
- **Privacy Modal:** See exactly what data is (and isn't) shared.
- **Admin KYC Approval:** Demo instant KYC approval for judges.
- **MongoDB Atlas Integration:** Cloud database for KYC and profile edits.
- **Auth0 Integration:** Secure authentication and profile management.

---

## 🖥️ Live Demo (Local)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/adilwiser/Data_Hackfest.git
   cd Data_Hackfest
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up your `.env` file:**
   - Copy `.env.example` to `.env` (or use the provided `.env`)
   - Fill in your Auth0 and MongoDB Atlas credentials
4. **Start the server:**
   ```bash
   npm start
   ```
5. **Visit:** [http://localhost:3000](http://localhost:3000)

---

## 📝 How to Test (For Judges)

1. **Sign up or log in** (Auth0 handles authentication)
2. **Go to Dashboard**
3. **Start KYC Process**
   - Enter your details (your sensitive data never leaves your device)
   - Submit KYC (only a ZKP proof and over18 flag are sent)
4. **Approve KYC as Admin**
   - Copy your `userId` from the dashboard
   - Visit `/admin/approve/<userId>` (e.g., `http://localhost:3000/admin/approve/auth0|abc123`)
   - You will be redirected to the dashboard and see your KYC as Verified
5. **Explore ZKP Animation**
   - Click "What is ZKP?" for animated, real-world ZKP examples (age, passwordless login, voting, DeFi)
6. **Edit Profile**
   - Try changing your nickname or avatar (local, privacy-friendly)

---

## 🔒 ZKP & Privacy Explained

- **Zero-Knowledge Proofs** let you prove facts (like age, password knowledge, or voting) without revealing the underlying data.
- **This app simulates ZKP** for age verification and passwordless login.
- **No sensitive data is stored**—only the proof and a boolean flag.
- **See the ZKP animation page** for more real-world use cases!

---

## ⚡ Why Not a Full Cryptographic ZKP?

- **Real ZKP circuits (e.g., Circom, snarkjs)** require complex setup, trusted setups, and significant compute resources.
- **Hackathon constraints:** Most hackathon environments (and even many AI tools) can't generate or verify real ZKP circuits in-browser or on free-tier cloud.
- **This demo focuses on UX, privacy, and education**—but the architecture is ready for real ZKP integration if you want to extend it!

---

## 🛠️ Tech Stack
- Node.js, Express, EJS
# ZKP KYC Demo – Data Hackfest

![Pixel Art Banner](public/default-avatar.png)

## Overview
This project is a privacy-first, pixel-art themed KYC (Know Your Customer) web app. It demonstrates how Zero-Knowledge Proofs (ZKPs) can be used to verify user claims (like age) without exposing sensitive data. Built with Node.js, Express, Auth0, MongoDB Atlas, and EJS.

---

## Features
- Prove you are over 18 without revealing your birthdate (ZKP simulation)
- Animated ZKP explanation page with real-world examples (age, passwordless login, voting, DeFi)
- Pixel-art inspired, user-friendly UI
- Local avatar selection for privacy
- Privacy modal explaining what data is shared
- Admin KYC approval route for easy testing
- MongoDB Atlas for cloud data storage
- Auth0 for secure authentication

---

## Quick Start
1. **Clone this repository:**
   ```bash
   git clone https://github.com/adilwiser/Data_Hackfest.git
   cd Data_Hackfest
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Auth0 and MongoDB Atlas:**
   - [Create a free Auth0 account](https://auth0.com/signup) and set up a Regular Web Application.
   - [Create a free MongoDB Atlas cluster](https://www.mongodb.com/cloud/atlas/register).
   - Copy `.env.example` to `.env` and fill in your Auth0 and MongoDB Atlas credentials.
4. **Start the server:**
   ```bash
   npm start
   ```
5. **Open your browser:**
   - Go to [http://localhost:3000](http://localhost:3000)

---

## How to Use / Test
1. **Sign up or log in** (Auth0 handles authentication)
2. **Dashboard:**
   - See your KYC status and userId (for admin approval)
3. **Start KYC:**
   - Enter your details (your sensitive data never leaves your device)
   - Submit KYC (only a ZKP proof and over18 flag are sent)
4. **Admin Approval:**
   - Copy your userId from the dashboard
   - Visit `/admin/approve/<userId>` (e.g., `http://localhost:3000/admin/approve/auth0|abc123`)
   - You will be redirected to the dashboard and see your KYC as Verified
5. **ZKP Animation:**
   - Click "What is ZKP?" for animated, real-world ZKP examples
6. **Edit Profile:**
   - Change your nickname or avatar (local, privacy-friendly)

---

## ZKP & Privacy
- Zero-Knowledge Proofs let you prove facts (like age, password knowledge, or voting) without revealing the underlying data.
- This app simulates ZKP for age verification and passwordless login.
- No sensitive data is stored—only the proof and a boolean flag.
- See the ZKP animation page for more real-world use cases.

---

## Why Not a Full Cryptographic ZKP?
- Real ZKP circuits (e.g., Circom, snarkjs) require complex setup, trusted setups, and significant compute resources.
- Most hackathon environments (and even many AI tools) can't generate or verify real ZKP circuits in-browser or on free-tier cloud.
- This demo focuses on user experience, privacy, and education—but the architecture is ready for real ZKP integration if you want to extend it.

---

## Tech Stack
- Node.js, Express, EJS
- Auth0 (express-openid-connect, ManagementClient)
- MongoDB Atlas
- Circom (for future/real ZKP integration)
- Custom pixel-art CSS

---

## Author & Credits
- Built by [adilwiser](https://github.com/adilwiser) for Data Hackfest 2025
- Inspired by privacy-first web3 and ZKP projects

---

## Project Structure
```
Data_Hackfest/
├── server.js
├── package.json
├── .env.example
├── README.md
├── public/
│   ├── avatars/
│   └── default-avatar.png
├── views/
│   ├── dashboard.ejs
│   ├── kyc.ejs
│   ├── profile.ejs
│   ├── edit-profile.ejs
│   ├── zkp-explained.ejs
│   └── ...
└── circuits/
    └── age_check.circom (for future real ZKP)
```

---

## Contributing / Extending
- Add real ZKP circuits (Circom, snarkjs) if you want to go deeper
- Use for any privacy-first onboarding, voting, or DeFi demo
- PRs and feedback welcome!

---

> "Prove it, without revealing it!" – The magic of Zero-Knowledge Proofs

