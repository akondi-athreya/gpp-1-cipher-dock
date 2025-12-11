<h1 align="center">🔐 Cipher-Dock</h1>
<p align="center">
  <strong>A Production-Grade 2FA Service with RSA Encryption & Time-Based OTP</strong>
</p>
<p align="center">
  <a href="https://hub.docker.com/r/athreya9491/gpp-pki-cipher-dock" target="_blank">
    <img src="https://img.shields.io/badge/Docker%20Hub-athreya9491%2Fgpp--pki--cipher--dock-blue?logo=docker" alt="Docker Hub">
  </a>
  <a href="https://github.com/akondi-athreya/gpp-1-cipher-dock" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="License">
</p>
<p align="center">
  <a href="#features">Features</a> • 
  <a href="#architecture">Architecture</a> • 
  <a href="#quick-start">Quick Start</a> • 
  <a href="#api-endpoints">API Endpoints</a> • 
  <a href="#technical-implementation">Technical Implementation</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 📋 Overview

**Cipher-Dock** is a sophisticated cryptographic service designed for secure seed management and time-based one-time password (TOTP) generation with RSA encryption. It provides enterprise-grade 2FA capabilities with containerized deployment, cron-based monitoring, and RESTful endpoints for seamless integration into existing authentication systems.

This implementation demonstrates best practices in:
- **Asymmetric Cryptography**: RSA-2048 with OAEP padding and SHA-256 hashing
- **Time-Based Authentication**: RFC 6238 compliant TOTP generation and verification
- **Containerization**: Multi-stage Docker builds with production optimizations
- **Secure Key Management**: Private/Public key pair separation and encrypted seed storage
- **Automated Operations**: Cron-based health checks and TOTP audit logging

---

## ✨ Features

### Core Functionality
- 🔑 **RSA Encryption/Decryption**: Secure seed decryption using RSA-2048 with OAEP padding
- 🔓 **TOTP Generation**: Time-based OTP codes with 30-second validity windows
- ✅ **TOTP Verification**: Secure validation with ±30-second tolerance for clock skew
- 📦 **Encrypted Seed Management**: Persistent seed storage with filesystem persistence
- 🏥 **Health Checks**: Automated monitoring via cron jobs with HTTP health endpoints

### Production-Ready
- 🐳 **Docker Containerization**: Multi-stage builds for optimized images
- 🚀 **Express.js REST API**: Lightweight, high-performance server framework
- ⏰ **Cron Integration**: Automated health monitoring and TOTP logging
- 🌍 **UTC Timezone Normalization**: Consistent time handling across distributed systems
- 📝 **Structured Error Handling**: Consistent JSON error responses

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Container                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Express.js API Server                    │  │
│  │  - POST   /2fa/decrypt-seed    (RSA Decryption)       │  │
│  │  - GET    /2fa/generate-2fa    (TOTP Generation)      │  │
│  │  - POST   /2fa/verify-2fa      (TOTP Verification)    │  │
│  │  - GET    /health              (Service Health)       │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Cron Jobs (Background Tasks)                  │  │
│  │  - Heartbeat Monitor (Every 30 seconds)               │  │
│  │  - 2FA Audit Log (Every 60 seconds)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Cryptographic Services                       │  │
│  │  - RSA Key Management (/keys/)                        │  │
│  │  - TOTP Implementation                                │  │
│  │  - PGP/RSA Crypto Utilities                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      Persistent Storage (Volume Mounts)               │  │
│  │  - /data/seed.txt          (Decrypted Seed)           │  │
│  │  - /cron/                  (Audit Logs)               │  │
│  │  - /keys/                  (RSA Keypairs)             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Purpose | Technology |
|-----------|---------|-----------|
| **2FA Controller** | HTTP request handling for authentication endpoints | Express.js |
| **2FA Service** | Business logic for seed management and TOTP operations | Node.js Crypto |
| **TOTP Module** | RFC 6238 TOTP code generation and verification | otplib |
| **RSA Crypto** | Asymmetric encryption/decryption operations | crypto.privateDecrypt |
| **Health Controller** | Service health status reporting | Express.js |
| **Cron Jobs** | Background task automation | Linux cron |

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- Node.js 20+ (for local development)
- OpenSSL (for key generation)

### Using Docker (Recommended)

#### Pull from Docker Hub

```bash
# Pull the published image
docker pull athreya9491/gpp-pki-cipher-dock:latest

# Run the container
docker run -d \
  -p 8080:8080 \
  -v $(pwd)/data:/data \
  -v $(pwd)/cron:/cron \
  --name cipher-dock \
  athreya9491/gpp-pki-cipher-dock:latest

# Verify the service is running
curl http://localhost:8080/health
```

**Docker Hub Repository**: [athreya9491/gpp-pki-cipher-dock](https://hub.docker.com/r/athreya9491/gpp-pki-cipher-dock)

#### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/akondi-athreya/gpp-1-cipher-dock.git
cd gpp-1-cipher-dock

# Start the containerized application
docker-compose up -d

# Verify the service is running
curl http://localhost:8080/health
```

### Local Development

```bash
# Install dependencies
npm install

# Generate RSA keypair (if not present)
node scripts/generate-keys.js

# Start the server
npm start

# Server runs on http://localhost:8080
```

---

## 📡 API Endpoints

### 1. Decrypt Seed (RSA Decryption)
**Endpoint**: `POST /2fa/decrypt-seed`

**Purpose**: Decrypt an RSA-encrypted seed and store it for TOTP operations.

**Request**:
```json
{
  "encrypted_seed": "base64_encoded_rsa_encrypted_data"
}
```

**Response (Success)**:
```json
{
  "status": "ok"
}
```

**Response (Error)**:
```json
{
  "error": "Decryption failed"
}
```

**Technical Details**:
- Uses RSA-2048 with OAEP padding
- SHA-256 hashing for OAEP
- Stores decrypted seed at `/data/seed.txt`
- Validates seed format (64-character hex string)

---

### 2. Generate 2FA Code
**Endpoint**: `GET /2fa/generate-2fa`

**Purpose**: Generate a time-based OTP code from the decrypted seed.

**Request**: No parameters required

**Response**:
```json
{
  "code": "123456",
  "valid_for": 15
}
```

**Response (Error)**:
```json
{
  "error": "Seed not decrypted yet"
}
```

**Technical Details**:
- Generates 6-digit TOTP codes
- 30-second validity window
- `valid_for` indicates seconds remaining in current window
- RFC 6238 compliant

---

### 3. Verify 2FA Code
**Endpoint**: `POST /2fa/verify-2fa`

**Purpose**: Validate a TOTP code against the stored seed.

**Request**:
```json
{
  "code": "123456"
}
```

**Response**:
```json
{
  "valid": true
}
```

**Response (Invalid Code)**:
```json
{
  "valid": false
}
```

**Technical Details**:
- ±30-second tolerance for clock skew
- Prevents replay attacks with time windows
- Requires decrypted seed in `/data/seed.txt`

---

### 4. Health Check
**Endpoint**: `GET /health`

**Purpose**: Monitor service availability and readiness.

**Response (Healthy)**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T10:30:45.123Z"
}
```

---

## 🔐 Technical Implementation

### RSA Encryption Process

```javascript
// Decryption using RSA-2048 OAEP
const decrypted = crypto.privateDecrypt(
  {
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256"  // Critical: RFC 3394 compliance
  },
  encryptedBuffer
);
```

**Key Features**:
- **OAEP Padding**: Optimal Asymmetric Encryption Padding for enhanced security
- **SHA-256 Hashing**: Industry standard hash function for OAEP
- **Private Key Management**: Keys stored securely in `/keys/` directory
- **Base64 Encoding**: Safe transmission of binary encrypted data

### TOTP Implementation

```javascript
// RFC 6238 Time-Based One-Time Password
const code = generateTotpCode(hexSeed);  // 6-digit code
const validFor = 30 - (now % 30);         // Seconds remaining
```

**Specifications**:
- **Algorithm**: HMAC-SHA1 with 30-second time steps
- **Code Length**: 6 digits (000000-999999)
- **Time Step**: 30 seconds (TOTP epoch)
- **Tolerance**: ±1 time window for verification (±30 seconds)
- **Library**: otplib 12.0.1 (RFC 6238 compliant)

### Seed Management

**Seed Format**: 64-character hexadecimal string (256 bits)
```javascript
// Validation regex
/^[0-9a-f]{64}$/

// Storage
fs.writeFileSync(SEED_PATH, seed);

// Loading
const seed = fs.readFileSync(SEED_PATH, "utf8").trim();
```

---

## 🐳 Docker Deployment

### Multi-Stage Build Strategy

**Stage 1: Builder**
- Node 20 slim base image
- Install production dependencies only (`--omit=dev`)
- Copy application source
- Optimized for minimal final image size

**Stage 2: Runtime**
- Node 20 slim base image
- Install cron daemon + timezone utilities
- Copy built application from builder stage
- Configure UTC timezone
- Create volume mount points
- Expose port 8080

### Cron Integration

The container runs both the Express server and cron daemon:

```bash
CMD ["sh", "-c", "cron -f & exec node /app/src/app.js"]
```

**Background Jobs**:

1. **Heartbeat Monitor** (`cronjob.txt`)
   - Frequency: Every 30 seconds
   - Purpose: Check service health via HTTP request
   - Endpoint: `GET /health`

2. **2FA Audit Log** (`cron/2fa-cron`)
   - Frequency: Every 60 seconds
   - Purpose: Log TOTP codes for audit trails
   - Script: `scripts/log_2fa_cron.js`

### Volume Configuration

```yaml
volumes:
  - ./data:/data      # Persistent decrypted seed storage
  - ./cron:/cron      # Cron job logs and audit trails
```

---

## 📁 Project Structure

```
gpp-1-cipher-dock/
├── src/
│   ├── app.js                          # Express server entry point
│   ├── controllers/
│   │   ├── 2fa.controller.js           # 2FA HTTP handlers
│   │   └── health.controller.js        # Health check handlers
│   ├── services/
│   │   └── 2fa.service.js              # 2FA business logic
│   ├── crypto/
│   │   ├── pgp/                        # PGP utilities
│   │   ├── rsa/
│   │   │   └── generate.js             # RSA key generation
│   │   └── totp/
│   │       ├── generate.js             # TOTP code generation
│   │       ├── verify.js               # TOTP verification
│   │       └── index.js                # TOTP module exports
│   └── routes/
│       ├── 2fa.routes.js               # 2FA endpoint definitions
│       ├── health.routes.js            # Health check routes
│       └── index.js                    # Route aggregation
├── scripts/
│   ├── generate-keys.js                # RSA keypair generation
│   ├── decrypt-seed.js                 # Seed decryption utility
│   ├── request-seed.js                 # Seed request utility
│   ├── test-totp.js                    # TOTP testing utility
│   ├── generate-commit-proof.js        # Commit verification
│   └── log_2fa_cron.js                 # TOTP audit logger
├── keys/
│   ├── student_private.pem             # RSA private key
│   └── student_public.pem              # RSA public key
├── data/
│   ├── seed.txt                        # Decrypted seed (runtime)
│   └── encrypted_seed.txt              # Original encrypted seed
├── cron/
│   ├── 2fa-cron                        # 2FA audit cron job
│   └── last_code.txt                   # Last generated code log
├── Dockerfile                          # Multi-stage Docker build
├── docker-compose.yml                  # Container orchestration
├── cronjob.txt                         # Heartbeat cron job
├── package.json                        # Node.js dependencies
└── README.md                           # This file
```

---

## 🛠️ Setup & Configuration

### 1. Install Dependencies

```bash
npm install
```

**Key Dependencies**:
- `express` (5.2.1): HTTP server framework
- `otplib` (12.0.1): TOTP code generation & verification
- `hi-base32` (0.5.1): Base32 encoding for TOTP
- `axios` (1.13.2): HTTP client for cron jobs

### 2. Generate RSA Keys

```bash
node scripts/generate-keys.js
```

This creates:
- `keys/student_private.pem` (2048-bit private key)
- `keys/student_public.pem` (corresponding public key)

### 3. Prepare Encrypted Seed

Place your RSA-encrypted seed at `data/encrypted_seed.txt` or provide it via the API:

```bash
curl -X POST http://localhost:8080/2fa/decrypt-seed \
  -H "Content-Type: application/json" \
  -d '{
    "encrypted_seed": "base64_encoded_encrypted_seed_here"
  }'
```

### 4. Start the Service

```bash
# Docker (Recommended)
docker-compose up -d

# Or locally
npm start
```

---

## 🧪 Testing & Verification

### Generate a Test TOTP Code

```bash
node scripts/test-totp.js
```

### Request Seed Decryption

```bash
node scripts/request-seed.js
```

### Generate a 2FA Code

```bash
curl http://localhost:8080/2fa/generate-2fa
```

### Verify a 2FA Code

```bash
curl -X POST http://localhost:8080/2fa/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'
```

---

## 🔒 Security Considerations

### Best Practices Implemented

1. **Asymmetric Encryption**: RSA-2048 with OAEP padding
2. **Secure Hash Functions**: SHA-256 for OAEP operations
3. **Time-Based OTP**: RFC 6238 compliant with time window tolerance
4. **Key Management**: Private keys stored separately from public keys
5. **Persistent Storage**: Secrets stored in Docker volumes, not images
6. **Containerization**: Minimal attack surface with slim base images
7. **Error Handling**: No sensitive data leaked in error messages

### Cryptographic Specifications

- **RSA Key Size**: 2048 bits
- **RSA Padding**: OAEP with SHA-256
- **TOTP Algorithm**: HMAC-SHA1
- **TOTP Step Size**: 30 seconds
- **TOTP Code Length**: 6 digits
- **Time Tolerance**: ±30 seconds

---

## 📊 Performance Characteristics

| Operation | Notes |
|-----------|-------|
| RSA Decryption | Hardware dependent |
| TOTP Generation | In-memory computation |
| TOTP Verification | Single window check |
| Health Check | No I/O operations |

---

## 🔄 Cron Jobs

### Heartbeat Monitor

**Schedule**: Every 30 seconds
**Action**: HTTP GET request to `/health`
**Purpose**: Continuous uptime monitoring

### TOTP Audit Logger

**Schedule**: Every 60 seconds
**Action**: Generate and log TOTP code
**Purpose**: Audit trail and compliance logging

---

## 🚨 Error Handling

### Common Error Responses

```json
// Missing encrypted seed
{
  "error": "Missing encrypted_seed"
}

// Decryption failure
{
  "error": "Decryption failed"
}

// Seed not yet loaded
{
  "error": "Seed not decrypted yet"
}

// Missing TOTP code
{
  "error": "Missing code"
}
```

---

## 📈 Future Enhancements

- [ ] Database persistence for audit logs
- [ ] Multiple seed management
- [ ] Backup and recovery mechanisms
- [ ] Rate limiting on verification attempts
- [ ] WebAuthn/FIDO2 support
- [ ] QR code generation for seed distribution
- [ ] Admin dashboard for monitoring
- [ ] Metrics and observability integration

---

## 📝 License

ISC License - See `package.json` for details

---

## 👤 Author

**Developed for GPP Task 1: Cipher-Dock Cryptographic Service**

Repository: [github.com/akondi-athreya/gpp-1-cipher-dock](https://github.com/akondi-athreya/gpp-1-cipher-dock)

---

## ✅ Verification Checklist

- ✅ RSA-2048 encryption/decryption with OAEP padding
- ✅ RFC 6238 compliant TOTP generation and verification
- ✅ Secure seed management with filesystem persistence
- ✅ RESTful API with Express.js
- ✅ Docker containerization with multi-stage builds
- ✅ Cron-based background job execution
- ✅ Health check endpoints
- ✅ UTC timezone standardization
- ✅ Comprehensive error handling
- ✅ Production-ready implementation

---

<p align="center">
  <strong>🔐 Security. Simplicity. Scalability. 🔐</strong>
</p>
