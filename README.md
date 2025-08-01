# 🚀 Full-Stack Node.js + React App Deployment on AWS (S3 + ECR + ECS (EC2 Launch Type))

This project demonstrates how to deploy a full-stack application using AWS services **without CI/CD tools or a load balancer**. The application includes a React frontend and a Node.js backend, deployed as follows:

- **Frontend** hosted on **Amazon S3** as a static website
- **Backend** containerized with **Docker**, pushed to **Amazon ECR**
- Backend deployed to **Amazon ECS** using the **EC2 launch type**

---

## 🧰 Tech Stack

- **Frontend**: React
- **Backend**: Node.js
- **Containerization**: Docker
- **Deployment**: AWS ECS (EC2 launch type)
- **Image Registry**: Amazon ECR
- **Static Hosting**: Amazon S3

---

## 🌐 Live Architecture

```
User --> S3 Hosted React Frontend --> API Calls --> ECS Task (EC2) --> Node.js Backend
```

---

## Steps to Deploy

### 1. React Frontend → S3

1. Navigate to `frontend/` and build the React app:
   
   ```bash
   npm install
   npm run build
   ```
3. Create an **S3 bucket** with static website hosting enabled.
4. Upload the contents of the `build/` folder to the bucket.

---

### 2. Node.js Backend → Docker → ECR

1. Navigate to `backend/` 

2. Build and test the image on ec2:
   ```bash
   docker build -t fullstack-app .
   docker run -p 4000:4000 fullstack-app
   ```
Test it on browser `<ec2-public-ip>:4000`

### 3. Create an **ECR repository** and push the docker image: 

   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

   docker tag node-backend <aws_account_id>.dkr.ecr.<region>.amazonaws.com/fullstack-app

   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/fullstack-app
   ```

---

### 4. Create IAM Role for cluster (attach below policies)
- AmazonECSTaskExecutionRolePolicy
- AmazonEC2ContainerServiceforEC2Role

### 5 Create ECS Cluster
- Create an **ECS Cluster** using the EC2 launch type.
- Create a **Task Definition**:
   - Add container using the ECR image URL
   - Set container port to `4000`
- Create a **Service** in cluster
- Under cluster ➪ task open the **Public IP** with port 4000
   
---

## 📌 Notes

- No CI/CD or ALB was used — deployment was done **manually** via AWS Console and CLI for learning purposes.
- S3 site can be accessed via its public endpoint.
- Backend is accessible via the EC2 instance running the ECS task.

---

📘 [Read the full step-by-step blog here](https://visheshblog.hashnode.dev/project-3-deploying-a-full-stack-node-react-app-on-aws-using-s3-ecr-and-ecs-ec2-launch-type)

---
---
---
---
---

# 🚀 Full-Stack Node.js + React App Deployment on AWS (S3 + ECR + ECS Fargate + ALB)

This project demonstrates how to deploy a full-stack application on AWS using **ECS with the Fargate launch type** and an **Application Load Balancer (ALB)**. The app consists of a React frontend and a Node.js backend, deployed using the following:

- **Frontend** hosted on **Amazon S3** as a static website  
- **Backend** containerized with **Docker**, pushed to **Amazon ECR**  
- **Deployed using ECS (Fargate launch type)** with **ALB** for routing traffic  

---

## 🧰 Tech Stack

- **Frontend**: React  
- **Backend**: Node.js  
- **Containerization**: Docker  
- **Deployment**: AWS ECS (Fargate launch type)  
- **Image Registry**: Amazon ECR  
- **Static Hosting**: Amazon S3  
- **Load Balancer**: Application Load Balancer (ALB)  

---

## 🌐 Live Architecture

```
User --> S3 Hosted React Frontend --> API Calls --> ALB --> ECS Task (Fargate) --> Node.js Backend
```

---

## Steps to Deploy

### 1. React Frontend → S3

1. Navigate to `frontend/` and build the React app:

   ```bash
   npm install
   npm run build
   ```

2. Create an **S3 bucket** with static website hosting enabled.

3. Upload the contents of the `build/` folder to the bucket.

4. Enable **public access** (for testing purposes) and note the **Website Endpoint URL**.

---

### 2. Node.js Backend → Docker → ECR

1. Navigate to `backend/`

2. Build and test the Docker image on ec2-instance:

   ```bash
   docker build -t fullstack-app .
   docker run -p 4000:4000 fullstack-app
   ```

3. Create an **ECR repository** and push the image:

   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

   docker tag fullstack-app <aws_account_id>.dkr.ecr.<region>.amazonaws.com/fullstack-app

   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/fullstack-app
   ```

---

### 3. Create Application Load Balancer (ALB)

   - Listener: HTTP (port 80)  
   - Create a Target Group (type: IP)  
   - Configure health check path (e.g. `/api/health` if applicable)

---

### 4. Create IAM Role for cluster (attach below policies)

- AmazonECSTaskExecutionRolePolicy
- AmazonEC2ContainerServiceforEC2Role
- AdministratorAccess (Optional)

---

### 5. Create ECS Cluster

1. Go to ECS → Create Cluster → Select **Networking only (Fargate)**
2. Create Task Definition
   - Launch type: FARGATE  
   - Network mode: awsvpc  
   - Add container:
     - Use ECR image URL
     - Port mappings: `4000`
   - Set Task Role: `ecsTaskExecutionRole`

---

### 6. Create ECS Service

   - Launch type: Fargate  
   - Desired tasks: 1  
   - Attach ALB and Target Group  
   - Choose appropriate VPC, subnets, and security groups

---

### 7. Once service is running, get the **ALB DNS Name** and open it in your browser:

   ```
   http://<ALB-DNS-Name>:4000
   ```

---

## 📌 Notes

- This deployment uses **Fargate**, so you don’t have to manage any EC2 instances.  
- **ALB** handles traffic routing to the backend ECS tasks.  
- You can optionally serve the React app inside ECS, but here it's hosted separately on **S3**.  
- No CI/CD pipeline is used — all resources were provisioned **manually** using the AWS Console and CLI.

---

📘 [Read the full step-by-step blog here](https://visheshblog.hashnode.dev/project-4-deploying-a-full-stack-nodejs-react-application-on-aws-fargate)

