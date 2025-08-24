---
title: "AWS 云服务实践指南"
excerpt: "深入学习 AWS 云服务，掌握 EC2、S3、RDS、Lambda 等核心服务，学会构建可扩展的云原生应用。"
date: "2024-01-06"
category: "cloud"
tags: ["aws", "cloud", "ec2", "lambda", "devops"]
cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "24 min"
---

# AWS 云服务实践指南

Amazon Web Services (AWS) 是全球领先的云计算平台，提供超过 200 项服务。本文将带你从基础开始，系统学习 AWS 核心服务和最佳实践。

## AWS 核心概念

### 云计算服务模型

☁️ **IaaS (基础设施即服务)**：EC2、VPC、EBS  
⚙️ **PaaS (平台即服务)**：Elastic Beanstalk、Lambda  
📱 **SaaS (软件即服务)**：WorkSpaces、Chime  

### AWS 全球基础设施

🌍 **区域 (Regions)**：地理位置独立的数据中心集群  
🏢 **可用区 (Availability Zones)**：区域内的独立数据中心  
⚡ **边缘站点 (Edge Locations)**：内容分发网络节点  

### 核心服务概览

| 类别 | 服务 | 用途 |
|------|------|------|
| 计算 | EC2, Lambda, ECS | 虚拟服务器、无服务器计算 |
| 存储 | S3, EBS, EFS | 对象存储、块存储、文件存储 |
| 数据库 | RDS, DynamoDB, Aurora | 关系型、NoSQL 数据库 |
| 网络 | VPC, CloudFront, Route 53 | 虚拟网络、CDN、DNS |
| 安全 | IAM, KMS, WAF | 身份管理、加密、防火墙 |

## EC2 虚拟服务器

### 实例创建和管理

```bash
# 使用 AWS CLI 创建 EC2 实例
# 首先配置 AWS CLI
aws configure

# 创建密钥对
aws ec2 create-key-pair --key-name my-key-pair --query 'KeyMaterial' --output text > my-key-pair.pem
chmod 400 my-key-pair.pem

# 创建安全组
aws ec2 create-security-group \
    --group-name my-security-group \
    --description "My security group"

# 添加入站规则（SSH 和 HTTP）
aws ec2 authorize-security-group-ingress \
    --group-name my-security-group \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-name my-security-group \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# 启动 EC2 实例
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --count 1 \
    --instance-type t3.micro \
    --key-name my-key-pair \
    --security-groups my-security-group \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-web-server}]'
```

### 用户数据脚本

```bash
#!/bin/bash
# 用户数据脚本 - 在实例启动时自动执行

# 更新系统
yum update -y

# 安装 Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 安装 Nginx
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# 配置 Nginx
cat > /etc/nginx/conf.d/app.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

systemctl reload nginx

# 部署应用
cd /home/ec2-user
git clone https://github.com/your-username/your-app.git
cd your-app
npm install
pm2 start app.js --name "web-app"
pm2 startup
pm2 save
```

### Auto Scaling 自动扩缩容

```json
{
  "LaunchTemplateName": "my-launch-template",
  "LaunchTemplateData": {
    "ImageId": "ami-0abcdef1234567890",
    "InstanceType": "t3.micro",
    "KeyName": "my-key-pair",
    "SecurityGroupIds": ["sg-12345678"],
    "UserData": "base64-encoded-user-data-script",
    "TagSpecifications": [
      {
        "ResourceType": "instance",
        "Tags": [
          {
            "Key": "Name",
            "Value": "auto-scaling-instance"
          }
        ]
      }
    ]
  }
}
```

```bash
# 创建启动模板
aws ec2 create-launch-template --cli-input-json file://launch-template.json

# 创建 Auto Scaling 组
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name my-asg \
    --launch-template LaunchTemplateName=my-launch-template,Version=1 \
    --min-size 1 \
    --max-size 5 \
    --desired-capacity 2 \
    --availability-zones us-west-2a us-west-2b

# 创建扩缩容策略
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name my-asg \
    --policy-name scale-up-policy \
    --scaling-adjustment 1 \
    --adjustment-type ChangeInCapacity
```

## S3 对象存储

### 基础操作

```bash
# 创建 S3 存储桶
aws s3 mb s3://my-unique-bucket-name-12345

# 上传文件
aws s3 cp myfile.txt s3://my-unique-bucket-name-12345/
aws s3 cp myfolder/ s3://my-unique-bucket-name-12345/myfolder/ --recursive

# 下载文件
aws s3 cp s3://my-unique-bucket-name-12345/myfile.txt ./
aws s3 sync s3://my-unique-bucket-name-12345/myfolder/ ./myfolder/

# 列出对象
aws s3 ls s3://my-unique-bucket-name-12345/

# 删除对象
aws s3 rm s3://my-unique-bucket-name-12345/myfile.txt
aws s3 rm s3://my-unique-bucket-name-12345/myfolder/ --recursive
```

### S3 静态网站托管

```json
{
  "IndexDocument": {
    "Suffix": "index.html"
  },
  "ErrorDocument": {
    "Key": "error.html"
  }
}
```

```bash
# 配置静态网站托管
aws s3 website s3://my-website-bucket --index-document index.html --error-document error.html

# 设置存储桶策略（公开访问）
cat > bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-website-bucket/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket my-website-bucket --policy file://bucket-policy.json
```

### Node.js SDK 操作

```javascript
const AWS = require('aws-sdk');

// 配置 AWS SDK
AWS.config.update({
  region: 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

class S3Service {
  // 上传文件
  async uploadFile(bucketName, key, fileContent, contentType) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read'
    };

    try {
      const result = await s3.upload(params).promise();
      console.log('文件上传成功:', result.Location);
      return result;
    } catch (error) {
      console.error('文件上传失败:', error);
      throw error;
    }
  }

  // 获取文件
  async getFile(bucketName, key) {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      const result = await s3.getObject(params).promise();
      return result.Body;
    } catch (error) {
      console.error('文件获取失败:', error);
      throw error;
    }
  }

  // 生成预签名 URL
  async generatePresignedUrl(bucketName, key, expiresIn = 3600) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    };

    try {
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      console.error('生成预签名 URL 失败:', error);
      throw error;
    }
  }

  // 列出对象
  async listObjects(bucketName, prefix = '') {
    const params = {
      Bucket: bucketName,
      Prefix: prefix
    };

    try {
      const result = await s3.listObjectsV2(params).promise();
      return result.Contents;
    } catch (error) {
      console.error('列出对象失败:', error);
      throw error;
    }
  }

  // 删除文件
  async deleteFile(bucketName, key) {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
      console.log('文件删除成功:', key);
    } catch (error) {
      console.error('文件删除失败:', error);
      throw error;
    }
  }
}

module.exports = S3Service;
```

## Lambda 无服务器计算

### 创建 Lambda 函数

```javascript
// lambda/hello-world/index.js
exports.handler = async (event, context) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    console.log('Context: ', JSON.stringify(context, null, 2));

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            timestamp: new Date().toISOString(),
            requestId: context.awsRequestId
        })
    };

    return response;
};
```

### API Gateway 集成

```javascript
// lambda/api-handler/index.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const { httpMethod, path, pathParameters, body } = event;
    
    try {
        let response;
        
        switch (httpMethod) {
            case 'GET':
                if (pathParameters && pathParameters.id) {
                    response = await getUser(pathParameters.id);
                } else {
                    response = await getAllUsers();
                }
                break;
                
            case 'POST':
                const userData = JSON.parse(body);
                response = await createUser(userData);
                break;
                
            case 'PUT':
                const updateData = JSON.parse(body);
                response = await updateUser(pathParameters.id, updateData);
                break;
                
            case 'DELETE':
                response = await deleteUser(pathParameters.id);
                break;
                
            default:
                response = {
                    statusCode: 405,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
        
        return {
            ...response,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

async function getAllUsers() {
    const params = {
        TableName: 'Users'
    };
    
    const result = await dynamodb.scan(params).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            users: result.Items,
            count: result.Count
        })
    };
}

async function getUser(userId) {
    const params = {
        TableName: 'Users',
        Key: { id: userId }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'User not found' })
        };
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
    };
}

async function createUser(userData) {
    const user = {
        id: generateUUID(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const params = {
        TableName: 'Users',
        Item: user
    };
    
    await dynamodb.put(params).promise();
    
    return {
        statusCode: 201,
        body: JSON.stringify(user)
    };
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
```

### SAM 模板部署

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    Runtime: nodejs18.x
    Environment:
      Variables:
        TABLE_NAME: !Ref UsersTable

Resources:
  # Lambda 函数
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: lambda/api-handler/
      Handler: index.handler
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
      Events:
        GetUsers:
          Type: Api
          Properties:
            Path: /users
            Method: get
        GetUser:
          Type: Api
          Properties:
            Path: /users/{id}
            Method: get
        CreateUser:
          Type: Api
          Properties:
            Path: /users
            Method: post
        UpdateUser:
          Type: Api
          Properties:
            Path: /users/{id}
            Method: put
        DeleteUser:
          Type: Api
          Properties:
            Path: /users/{id}
            Method: delete

  # DynamoDB 表
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: Users
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST

Outputs:
  ApiUrl:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
  
  FunctionName:
    Description: "Lambda Function Name"
    Value: !Ref ApiFunction
  
  TableName:
    Description: "DynamoDB Table Name"
    Value: !Ref UsersTable
```

```bash
# 部署 SAM 应用
sam build
sam deploy --guided
```

## RDS 关系型数据库

### 创建 RDS 实例

```bash
# 创建 DB 子网组
aws rds create-db-subnet-group \
    --db-subnet-group-name my-db-subnet-group \
    --db-subnet-group-description "My DB subnet group" \
    --subnet-ids subnet-12345678 subnet-87654321

# 创建 RDS 实例
aws rds create-db-instance \
    --db-instance-identifier my-database \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0.35 \
    --allocated-storage 20 \
    --master-username admin \
    --master-user-password MySecurePassword123 \
    --db-subnet-group-name my-db-subnet-group \
    --vpc-security-group-ids sg-12345678 \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --deletion-protection
```

### 数据库连接和操作

```javascript
// db/connection.js
const mysql = require('mysql2/promise');

class DatabaseConnection {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 10,
            acquireTimeout: 60000,
            timeout: 60000
        });
    }

    async query(sql, params = []) {
        try {
            const [rows, fields] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    async getConnection() {
        return await this.pool.getConnection();
    }

    async closePool() {
        await this.pool.end();
    }
}

// 用户操作类
class UserRepository {
    constructor(db) {
        this.db = db;
    }

    async createUser(userData) {
        const { username, email, hashedPassword } = userData;
        const sql = `
            INSERT INTO users (username, email, password, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
        `;
        
        const result = await this.db.query(sql, [username, email, hashedPassword]);
        return { id: result.insertId, username, email };
    }

    async getUserById(id) {
        const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
        const users = await this.db.query(sql, [id]);
        return users[0] || null;
    }

    async getUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const users = await this.db.query(sql, [email]);
        return users[0] || null;
    }

    async updateUser(id, userData) {
        const { username, email } = userData;
        const sql = `
            UPDATE users 
            SET username = ?, email = ?, updated_at = NOW()
            WHERE id = ?
        `;
        
        await this.db.query(sql, [username, email, id]);
        return await this.getUserById(id);
    }

    async deleteUser(id) {
        const sql = 'DELETE FROM users WHERE id = ?';
        const result = await this.db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    async getAllUsers(limit = 10, offset = 0) {
        const sql = `
            SELECT id, username, email, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;
        
        return await this.db.query(sql, [limit, offset]);
    }
}

module.exports = { DatabaseConnection, UserRepository };
```

## VPC 网络配置

### VPC 创建和配置

```bash
# 创建 VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-vpc}]'

# 创建子网
# 公有子网
aws ec2 create-subnet \
    --vpc-id vpc-12345678 \
    --cidr-block 10.0.1.0/24 \
    --availability-zone us-west-2a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-subnet-1}]'

# 私有子网
aws ec2 create-subnet \
    --vpc-id vpc-12345678 \
    --cidr-block 10.0.2.0/24 \
    --availability-zone us-west-2b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-subnet-1}]'

# 创建互联网网关
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=my-igw}]'

# 附加到 VPC
aws ec2 attach-internet-gateway --vpc-id vpc-12345678 --internet-gateway-id igw-87654321

# 创建路由表
aws ec2 create-route-table --vpc-id vpc-12345678 --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=public-rt}]'

# 添加路由
aws ec2 create-route \
    --route-table-id rtb-12345678 \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id igw-87654321

# 关联子网到路由表
aws ec2 associate-route-table --subnet-id subnet-12345678 --route-table-id rtb-12345678
```

### CloudFormation 模板

```yaml
# infrastructure.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'VPC Infrastructure with public and private subnets'

Parameters:
  VpcCidr:
    Type: String
    Default: '10.0.0.0/16'
    Description: CIDR block for VPC

Resources:
  # VPC
  MyVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCidr
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: my-vpc

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: my-igw

  InternetGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      InternetGatewayId: !Ref InternetGateway
      VpcId: !Ref MyVPC

  # Public Subnets
  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: Public Subnet AZ1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      AvailabilityZone: !Select [ 1, !GetAZs '' ]
      CidrBlock: 10.0.2.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: Public Subnet AZ2

  # Private Subnets
  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      CidrBlock: 10.0.11.0/24
      Tags:
        - Key: Name
          Value: Private Subnet AZ1

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      AvailabilityZone: !Select [ 1, !GetAZs '' ]
      CidrBlock: 10.0.12.0/24
      Tags:
        - Key: Name
          Value: Private Subnet AZ2

  # NAT Gateways
  NatGateway1EIP:
    Type: AWS::EC2::EIP
    DependsOn: InternetGatewayAttachment
    Properties:
      Domain: vpc

  NatGateway1:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGateway1EIP.AllocationId
      SubnetId: !Ref PublicSubnet1

  # Route Tables
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref MyVPC
      Tags:
        - Key: Name
          Value: Public Routes

  DefaultPublicRoute:
    Type: AWS::EC2::Route
    DependsOn: InternetGatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet1

  PublicSubnet2RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet2

  PrivateRouteTable1:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref MyVPC
      Tags:
        - Key: Name
          Value: Private Routes AZ1

  DefaultPrivateRoute1:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable1
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway1

  PrivateSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PrivateRouteTable1
      SubnetId: !Ref PrivateSubnet1

Outputs:
  VPC:
    Description: VPC ID
    Value: !Ref MyVPC
    Export:
      Name: !Sub ${AWS::StackName}-VPC

  PublicSubnets:
    Description: Public subnets
    Value: !Join [ ",", [ !Ref PublicSubnet1, !Ref PublicSubnet2 ]]
    Export:
      Name: !Sub ${AWS::StackName}-PublicSubnets

  PrivateSubnets:
    Description: Private subnets
    Value: !Join [ ",", [ !Ref PrivateSubnet1, !Ref PrivateSubnet2 ]]
    Export:
      Name: !Sub ${AWS::StackName}-PrivateSubnets
```

## IAM 安全管理

### 用户和角色管理

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-bucket"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-west-2:123456789012:table/my-table"
      ]
    }
  ]
}
```

### Lambda 执行角色

```bash
# 创建信任策略
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# 创建角色
aws iam create-role \
    --role-name lambda-execution-role \
    --assume-role-policy-document file://trust-policy.json

# 附加策略
aws iam attach-role-policy \
    --role-name lambda-execution-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# 附加自定义策略
aws iam attach-role-policy \
    --role-name lambda-execution-role \
    --policy-arn arn:aws:iam::123456789012:policy/my-custom-policy
```

## 监控和日志

### CloudWatch 监控

```javascript
// cloudwatch-metrics.js
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

class MetricsService {
    async putMetric(metricName, value, unit = 'Count', namespace = 'MyApp') {
        const params = {
            Namespace: namespace,
            MetricData: [
                {
                    MetricName: metricName,
                    Value: value,
                    Unit: unit,
                    Timestamp: new Date()
                }
            ]
        };

        try {
            await cloudwatch.putMetricData(params).promise();
            console.log(`Metric ${metricName} sent successfully`);
        } catch (error) {
            console.error('Error sending metric:', error);
        }
    }

    async putCustomMetric(metricData) {
        const params = {
            Namespace: metricData.namespace || 'MyApp',
            MetricData: [
                {
                    MetricName: metricData.name,
                    Value: metricData.value,
                    Unit: metricData.unit || 'Count',
                    Dimensions: metricData.dimensions || [],
                    Timestamp: new Date()
                }
            ]
        };

        try {
            await cloudwatch.putMetricData(params).promise();
        } catch (error) {
            console.error('Error sending custom metric:', error);
        }
    }
}

// 使用示例
const metrics = new MetricsService();

// 记录API调用次数
await metrics.putMetric('ApiCalls', 1);

// 记录响应时间
await metrics.putCustomMetric({
    name: 'ResponseTime',
    value: 150,
    unit: 'Milliseconds',
    dimensions: [
        {
            Name: 'Endpoint',
            Value: '/api/users'
        }
    ]
});
```

### CloudWatch Logs

```javascript
// logger.js
const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs();

class Logger {
    constructor(logGroupName, logStreamName) {
        this.logGroupName = logGroupName;
        this.logStreamName = logStreamName;
        this.sequenceToken = null;
    }

    async createLogGroup() {
        try {
            await cloudwatchlogs.createLogGroup({
                logGroupName: this.logGroupName
            }).promise();
        } catch (error) {
            if (error.code !== 'ResourceAlreadyExistsException') {
                throw error;
            }
        }
    }

    async createLogStream() {
        try {
            await cloudwatchlogs.createLogStream({
                logGroupName: this.logGroupName,
                logStreamName: this.logStreamName
            }).promise();
        } catch (error) {
            if (error.code !== 'ResourceAlreadyExistsException') {
                throw error;
            }
        }
    }

    async log(message, level = 'INFO') {
        const logEvent = {
            message: JSON.stringify({
                level,
                message,
                timestamp: new Date().toISOString()
            }),
            timestamp: Date.now()
        };

        const params = {
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
            logEvents: [logEvent]
        };

        if (this.sequenceToken) {
            params.sequenceToken = this.sequenceToken;
        }

        try {
            const result = await cloudwatchlogs.putLogEvents(params).promise();
            this.sequenceToken = result.nextSequenceToken;
        } catch (error) {
            console.error('Error sending log:', error);
        }
    }
}

module.exports = Logger;
```

## CI/CD 和部署

### CodePipeline 配置

```yaml
# buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"my-app","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
```

### Terraform 基础设施即代码

```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-${count.index + 1}"
    Type = "Public"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "my-app"
      image     = "${var.app_image}:${var.app_version}"
      essential = true
      portMappings = [
        {
          containerPort = var.app_port
          hostPort      = var.app_port
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
    }
  ])
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "my-app"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}
```

## 成本优化

### 成本监控和预算

```bash
# 创建成本预算
aws budgets create-budget \
    --account-id 123456789012 \
    --budget '{
        "BudgetName": "Monthly-Budget",
        "BudgetLimit": {
            "Amount": "100.0",
            "Unit": "USD"
        },
        "TimeUnit": "MONTHLY",
        "BudgetType": "COST",
        "CostFilters": {}
    }' \
    --notifications-with-subscribers '[
        {
            "Notification": {
                "NotificationType": "ACTUAL",
                "ComparisonOperator": "GREATER_THAN",
                "Threshold": 80,
                "ThresholdType": "PERCENTAGE"
            },
            "Subscribers": [
                {
                    "SubscriptionType": "EMAIL",
                    "Address": "admin@example.com"
                }
            ]
        }
    ]'
```

### 最佳实践

```javascript
// 成本优化建议
const costOptimization = {
    ec2: {
        // 使用合适的实例类型
        rightSizing: "定期审查实例使用情况，选择合适大小",
        spotInstances: "对于容错工作负载使用 Spot 实例",
        reservedInstances: "对于稳定工作负载购买预留实例",
        autoShutdown: "为开发环境设置自动关机计划"
    },
    
    storage: {
        s3LifecyclePolicy: "设置 S3 生命周期策略，自动转移到更便宜的存储类",
        ebsOptimization: "删除未使用的 EBS 卷和快照",
        compressionAndDeduplication: "使用压缩和去重技术"
    },
    
    networking: {
        dataTransfer: "最小化跨区域数据传输",
        cloudfront: "使用 CloudFront 减少源站负载",
        directConnect: "对于大量数据传输考虑 Direct Connect"
    },
    
    monitoring: {
        cloudwatch: "设置成本异常检测",
        costExplorer: "定期分析成本趋势",
        tagging: "使用标签进行成本分配和跟踪"
    }
};
```

## 总结

AWS 云服务为现代应用提供了完整的解决方案：

✨ **弹性和可扩展性**：按需扩缩容，应对业务增长  
✨ **高可用性**：多区域部署，保证服务连续性  
✨ **安全性**：多层次安全防护，保护数据安全  
✨ **成本效益**：按使用量付费，优化成本支出  
✨ **丰富的服务**：涵盖计算、存储、数据库、AI 等各个领域  

掌握 AWS 云服务，让你的应用更加现代化、可靠、高效！

---

*云计算改变世界，AWS 助力企业数字化转型！*
