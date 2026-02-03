# Deploying Item-Management-System to Google Compute Engine (GCE)

This folder includes helper artifacts to deploy the app to a GCE VM:
- `startup-script.sh` — VM startup script that installs Node.js, clones your repo, installs dependencies, writes `.env`, and runs the backend as a `systemd` service.
- `deploy.sh` — convenience script that calls `gcloud compute instances create` and passes metadata.
- `Dockerfile` — optional container image for the backend if you prefer to run inside a container.

Prerequisites
- Install and authenticate the Google Cloud SDK (`gcloud`).
- Ensure you have a MongoDB connection string (MongoDB Atlas recommended) for `MONGODB_URI`.
- Ensure your repo is publicly accessible or that the VM has credentials to clone it.

Quick deploy (example)
1. Make `deploy.sh` executable:

```bash
chmod +x gce/deploy.sh
```

2. Run the helper with your repo URL and MongoDB URI:

```bash
./gce/deploy.sh https://github.com/your-user/your-repo.git "mongodb+srv://user:pass@cluster.example.mongodb.net/dbname"
```

What the script does
- Creates a Debian 11 VM and passes `REPO_URL` and `MONGODB_URI` via instance metadata.
- The VM runs `startup-script.sh` which clones the repo, installs Node, writes a `.env` in `backend/`, and starts the app with `systemd`.

Access
- The backend listens on port `8080` by default. `deploy.sh` creates a firewall rule to open TCP/8080.
- Find the VM IP with:

```bash
gcloud compute instances list --filter="name=( 'item-mgmt-vm' )"
```

Notes & next steps
- If your repo is private, use a deploy key or place the code in a Google Cloud Storage bucket and modify the startup script.
- For production, consider using HTTPS (set up an nginx reverse proxy and certbot) and a managed database (Cloud MongoDB/Atlas).
- You can also build the provided `gce/Dockerfile` and run the app inside a container on the VM.
