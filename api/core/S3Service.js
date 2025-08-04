const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadBucketCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const Logger = require('./Logger');

class S3Service {
    constructor() {
        this.logger = new Logger();
        
        // Determine if we're in development mode
        this.isDevelopment = process.env.NODE_ENV === 'development';
        
        // Configure S3 client based on environment
        const s3Config = {
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
            }
        };

        // Add local endpoint configuration for development
        if (this.isDevelopment) {
            s3Config.endpoint = process.env.LOCAL_S3_ENDPOINT || 'http://localhost:4566';
            s3Config.forcePathStyle = true;
            this.logger.info(`Using local S3 endpoint: ${s3Config.endpoint}`);
        }

        this.s3Client = new S3Client(s3Config);
        this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'local-bucket';
        
        this.logger.info(`S3Service initialized - Environment: ${this.isDevelopment ? 'development' : 'production'}, Bucket: ${this.bucketName}`);
    }

    async uploadImage(file, productId) {
        try {
            if (!file) {
                throw new Error('No file provided');
            }

            if (this.isDevelopment) {
                await this.createBucketIfNotExists();
            }

            const fileExtension = file.originalname.split('.').pop();
            const fileName = `products/${productId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
            
            const uploadParams = {
                Bucket: this.bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            };

            const command = new PutObjectCommand(uploadParams);
            
            // Add timeout wrapper to prevent hanging
            const uploadPromise = this.s3Client.send(command);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('S3 upload timeout after 30 seconds'));
                }, 30000); // 30 second timeout
            });
            
            await Promise.race([uploadPromise, timeoutPromise]);

            // Generate URL based on environment
            let imageUrl;
            if (this.isDevelopment) {
                const localEndpoint = process.env.LOCAL_S3_ENDPOINT || 'http://localhost:4566';
                imageUrl = `${localEndpoint}/${this.bucketName}/${fileName}`;
            } else {
                imageUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
            }
            
            this.logger.info(`Image uploaded successfully: ${imageUrl}`);
            
            return {
                success: true,
                url: imageUrl,
                key: fileName
            };
        } catch (error) {
            this.logger.error('S3 upload error:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    async deleteImage(imageKey, bucketName = null) {
        try {
            if (!imageKey) {
                throw new Error('Image key is required');
            }

            // Use provided bucket name or fall back to current bucket
            const targetBucket = bucketName || this.bucketName;

            const deleteParams = {
                Bucket: targetBucket,
                Key: imageKey
            };

            const command = new DeleteObjectCommand(deleteParams);
            
            // Add timeout to delete operation
            const deletePromise = this.s3Client.send(command);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('S3 delete timeout after 15 seconds'));
                }, 15000);
            });
            
            await Promise.race([deletePromise, timeoutPromise]);

            this.logger.info(`Image deleted successfully: ${imageKey} from bucket: ${targetBucket}`);
            
            return {
                success: true,
                message: 'Image deleted successfully',
                bucket: targetBucket
            };
        } catch (error) {
            this.logger.error(`S3 delete error for key ${imageKey} in bucket ${bucketName || this.bucketName}:`, error);
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }

    async deleteImageFromUrl(imageUrl) {
        try {
            if (!imageUrl) {
                throw new Error('Image URL is required');
            }

            const imageKey = this.extractKeyFromUrl(imageUrl);
            const bucketName = this.extractBucketFromUrl(imageUrl);

            if (!imageKey) {
                throw new Error('Could not extract image key from URL');
            }

            this.logger.info(`Attempting to delete image: ${imageKey} from bucket: ${bucketName}`);
            
            return await this.deleteImage(imageKey, bucketName);
        } catch (error) {
            this.logger.error('Delete image from URL error:', error);
            throw error;
        }
    }

    async getSignedUrl(key, expiresIn = 3600) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
            
            return {
                success: true,
                signedUrl
            };
        } catch (error) {
            this.logger.error('S3 signed URL error:', error);
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }

    async createBucketIfNotExists() {
        try {
            // Add timeout to bucket check
            const checkPromise = this.s3Client.send(
                new HeadBucketCommand({ Bucket: this.bucketName })
            );
            const checkTimeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Bucket check timeout after 10 seconds'));
                }, 10000);
            });
            
            await Promise.race([checkPromise, checkTimeoutPromise]);
            this.logger.info(`Bucket "${this.bucketName}" already exists.`);
        } catch (err) {
            this.logger.debug("Bucket check error", err);
            
            // Check for bucket not found errors (works for both AWS and LocalStack)
            if (err.name === 'NotFound' || 
                err.name === 'NoSuchBucket' || 
                err.$metadata?.httpStatusCode === 404 ||
                err.Code === 'NoSuchBucket' ||
                err.message.includes('timeout')) {
                
                try {
                    const createBucketParams = {
                        Bucket: this.bucketName
                    };
                    
                    // For LocalStack, we don't need location constraint for us-east-1
                    // For other regions, we would need to add CreateBucketConfiguration
                    if (!this.isDevelopment && process.env.AWS_REGION !== 'us-east-1') {
                        createBucketParams.CreateBucketConfiguration = {
                            LocationConstraint: process.env.AWS_REGION
                        };
                    }
                    
                    // Add timeout to bucket creation
                    const createPromise = this.s3Client.send(
                        new CreateBucketCommand(createBucketParams)
                    );
                    const createTimeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => {
                            reject(new Error('Bucket creation timeout after 15 seconds'));
                        }, 15000);
                    });
                    
                    await Promise.race([createPromise, createTimeoutPromise]);
                    this.logger.info(`Bucket "${this.bucketName}" created successfully.`);
                } catch (createErr) {
                    this.logger.error('Error creating bucket:', createErr);
                    throw new Error(`Failed to create bucket: ${createErr.message}`);
                }
            } else {
                this.logger.error('Error checking bucket:', err);
                throw new Error(`Failed to check bucket existence: ${err.message}`);
            }
        }
    }

    extractKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.substring(1); // Remove leading slash
        } catch (error) {
            this.logger.error('URL parsing error:', error);
            return null;
        }
    }

    extractBucketFromUrl(url) {
        try {
            const urlObj = new URL(url);
            
            // Handle different S3 URL formats
            if (urlObj.hostname.includes('s3.amazonaws.com')) {
                // Format: https://bucket-name.s3.region.amazonaws.com/key
                return urlObj.hostname.split('.')[0];
            } else if (urlObj.hostname.includes('amazonaws.com')) {
                // Format: https://s3.region.amazonaws.com/bucket-name/key
                const pathParts = urlObj.pathname.split('/');
                return pathParts[1]; // bucket name is first part after /
            } else if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1')) {
                // Local development format: http://localhost:4566/bucket-name/key
                const pathParts = urlObj.pathname.split('/');
                return pathParts[1]; // bucket name is first part after /
            }
            
            // Fallback: assume it's a custom domain or unknown format
            this.logger.warn(`Unknown S3 URL format: ${url}, using current bucket`);
            return this.bucketName;
        } catch (error) {
            this.logger.error('URL parsing error for bucket extraction:', error);
            return this.bucketName; // Fallback to current bucket
        }
    }
}

module.exports = S3Service; 