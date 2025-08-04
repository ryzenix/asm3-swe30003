const Product = require('../models/Product');
const Logger = require('../core/Logger');
const S3Service = require('../core/S3Service');

class ProductController {
    constructor() {
        this.productModel = new Product();
        this.logger = new Logger();
        this.s3Service = new S3Service();
    }

    async createProduct(req, res, next) {
        try {
            // First create the product without images to get the ID
            const { images, ...productDataWithoutImages } = req.body;
            
            const result = await this.productModel.create(productDataWithoutImages);
            const productId = result.data.id;
            
            // Process images if provided
            if (images && Array.isArray(images) && images.length > 0) {
                const processedData = await this.processBase64Images({ images }, productId);
                
                // Update the product with the processed images
                if (processedData.images && processedData.images.length > 0) {
                    await this.productModel.update(productId, {
                        images: processedData.images,
                        mainImageIndex: req.body.mainImageIndex || 0
                    });
                    
                    // Get the updated product data
                    const updatedResult = await this.productModel.getById(productId);
                    res.status(201).json(updatedResult);
                } else {
                    res.status(201).json(result);
                }
            } else {
                res.status(201).json(result);
            }
        } catch (error) {
            this.logger.error('Create product controller error:', error);
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            
            // Process any base64 images before updating the product
            const productData = await this.processBase64Images(req.body, id);
            
            const result = await this.productModel.update(id, productData);
            res.json(result);
        } catch (error) {
            this.logger.error('Update product controller error:', error);
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            
            // First, get the product to retrieve its images
            const productResult = await this.productModel.getById(id);
            if (!productResult.success) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            const product = productResult.data;
            const images = product.images || [];
            
            // Clean up S3 images before deleting the product
            const s3DeleteResults = [];
            if (images.length > 0) {
                this.logger.info(`Cleaning up ${images.length} images for product ${id}`);
                
                for (const imageUrl of images) {
                    try {
                        await this.s3Service.deleteImageFromUrl(imageUrl);
                        s3DeleteResults.push({ url: imageUrl, success: true });
                        this.logger.info(`Successfully deleted image: ${imageUrl}`);
                    } catch (s3Error) {
                        s3DeleteResults.push({ url: imageUrl, success: false, error: s3Error.message });
                        this.logger.warn(`Failed to delete image: ${imageUrl}. Error: ${s3Error.message}`);
                    }
                }
            }
            
            // Delete the product from database regardless of S3 cleanup results
            const result = await this.productModel.delete(id);
            
            // Enhance response with S3 cleanup information
            const enhancedResult = {
                ...result,
                imageCleanup: {
                    totalImages: images.length,
                    results: s3DeleteResults,
                    successfulDeletes: s3DeleteResults.filter(r => r.success).length,
                    failedDeletes: s3DeleteResults.filter(r => !r.success).length
                }
            };
            
            if (s3DeleteResults.some(r => !r.success)) {
                enhancedResult.warning = 'Product deleted successfully, but some images could not be removed from S3. They may still exist in storage.';
            }
            
            res.json(enhancedResult);
        } catch (error) {
            this.logger.error('Delete product controller error:', error);
            next(error);
        }
    }

    async getProduct(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.productModel.getById(id);
            res.json(result);
        } catch (error) {
            this.logger.error('Get product controller error:', error);
            next(error);
        }
    }

    async listProducts(req, res, next) {
        try {
            const filters = {
                page: req.query.page,
                limit: req.query.limit,
                search: req.query.search,
                category: req.query.category,
                status: req.query.status,
                manufacturer: req.query.manufacturer,
                sort: req.query.sort
            };
            
            const result = await this.productModel.list(filters);
            res.json(result);
        } catch (error) {
            this.logger.error('List products controller error:', error);
            next(error);
        }
    }

    async getFilterOptions(req, res, next) {
        try {
            const result = await this.productModel.getFilterOptions();
            res.json(result);
        } catch (error) {
            this.logger.error('Get filter options controller error:', error);
            next(error);
        }
    }

    async uploadImage(req, res, next) {
        try {
            const { productId } = req.params;
            
            if (!req.file) {
                const { ValidationError } = require('../core/errors');
                throw ValidationError.missingFields(['file']);
            }

            // Check if product exists
            const productResult = await this.productModel.getById(productId);
            
            // Upload image to S3
            const uploadResult = await this.s3Service.uploadImage(req.file, productId);
            
            // Get current product data
            const currentProduct = productResult.data;
            const currentImages = currentProduct.images || [];
            
            // Add new image to the array
            const updatedImages = [...currentImages, uploadResult.url];
            
            // Update product with new image array
            const updateResult = await this.productModel.update(productId, {
                images: updatedImages
            });

            res.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    imageUrl: uploadResult.url,
                    imageKey: uploadResult.key,
                    updatedImages: updatedImages
                }
            });
        } catch (error) {
            this.logger.error('Upload image controller error:', error);
            next(error);
        }
    }

    async deleteImage(req, res) {
        try {
            const { productId, imageIndex } = req.params;
            
            // Check if product exists
            const productResult = await this.productModel.getById(productId);
            if (!productResult.success) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            const currentProduct = productResult.data;
            const currentImages = currentProduct.images || [];
            
            if (imageIndex < 0 || imageIndex >= currentImages.length) {
                return res.status(400).json({
                    error: 'Invalid image index'
                });
            }

            const imageUrl = currentImages[imageIndex];
            let s3DeleteSuccess = false;
            let s3DeleteError = null;

            // Attempt to delete image from S3 using the URL (which contains bucket info)
            try {
                await this.s3Service.deleteImageFromUrl(imageUrl);
                s3DeleteSuccess = true;
                this.logger.info(`Successfully deleted image from S3: ${imageUrl}`);
            } catch (s3Error) {
                s3DeleteError = s3Error.message;
                this.logger.warn(`Failed to delete image from S3: ${imageUrl}. Error: ${s3Error.message}`);
                this.logger.info('Proceeding with database cleanup despite S3 deletion failure');
            }
            
            // Always proceed with database cleanup regardless of S3 deletion result
            // Remove image from array
            const updatedImages = currentImages.filter((_, index) => index !== parseInt(imageIndex));
            
            // Update main image index if necessary
            let mainImageIndex = currentProduct.mainImageIndex || 0;
            if (parseInt(imageIndex) === mainImageIndex) {
                mainImageIndex = updatedImages.length > 0 ? 0 : 0;
            } else if (parseInt(imageIndex) < mainImageIndex) {
                mainImageIndex = Math.max(0, mainImageIndex - 1);
            }
            
            // Update product in database
            const updateResult = await this.productModel.update(productId, {
                images: updatedImages,
                mainImageIndex: mainImageIndex
            });

            // Prepare response based on S3 deletion result
            const responseData = {
                success: true,
                message: s3DeleteSuccess 
                    ? 'Image deleted successfully from both S3 and database'
                    : 'Image removed from database (S3 deletion failed but database was cleaned up)',
                data: {
                    deletedImageUrl: imageUrl,
                    updatedImages: updatedImages,
                    mainImageIndex: mainImageIndex,
                    s3DeleteSuccess: s3DeleteSuccess
                }
            };

            // Add warning if S3 deletion failed
            if (!s3DeleteSuccess) {
                responseData.warning = `S3 deletion failed: ${s3DeleteError}. Image was removed from database but may still exist in S3.`;
            }

            res.json(responseData);
        } catch (error) {
            this.logger.error('Delete image controller error:', error);
            console.log(error);
            
            if (error.message.includes('Product not found')) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }
            
            if (error.message.includes('Invalid image index')) {
                return res.status(400).json({
                    error: 'Invalid image index'
                });
            }
            
            res.status(500).json({
                error: 'Failed to delete image: ' + error.message
            });
        }
    }

    async setMainImage(req, res) {
        try {
            const { productId, imageIndex } = req.params;
            
            // Check if product exists
            const productResult = await this.productModel.getById(productId);
            if (!productResult.success) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            const currentProduct = productResult.data;
            const currentImages = currentProduct.images || [];
            
            if (imageIndex < 0 || imageIndex >= currentImages.length) {
                return res.status(400).json({
                    error: 'Invalid image index'
                });
            }

            // Update main image index
            const updateResult = await this.productModel.update(productId, {
                mainImageIndex: parseInt(imageIndex)
            });

            res.json({
                success: true,
                message: 'Main image updated successfully',
                data: {
                    mainImageIndex: parseInt(imageIndex),
                    mainImageUrl: currentImages[parseInt(imageIndex)]
                }
            });
        } catch (error) {
            this.logger.error('Set main image controller error:', error);
            
            if (error.message.includes('Product not found')) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }
            
            if (error.message.includes('Invalid image index')) {
                return res.status(400).json({
                    error: 'Invalid image index'
                });
            }
            
            res.status(500).json({
                error: 'Failed to set main image: ' + error.message
            });
        }
    }

    async processBase64Images(productData, productId = null) {
        try {
            // Check if productData has base64 images
            if (!productData.images || !Array.isArray(productData.images)) {
                return productData;
            }

            const uploadedImageUrls = [];
            
            // Use provided productId or create a temporary one
            const uploadProductId = productId || Date.now();

            for (let i = 0; i < productData.images.length; i++) {
                const imageData = productData.images[i];
                
                // Check if it's a base64 image
                if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
                    // Extract mime type and base64 data
                    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
                    if (matches) {
                        const mimeType = matches[1];
                        const base64Data = matches[2];
                        
                        // Convert base64 to buffer
                        const buffer = Buffer.from(base64Data, 'base64');
                        
                        // Determine file extension from mime type
                        const fileExtension = mimeType.split('/')[1] || 'jpg';
                        
                        // Create a fake file object for the S3Service
                        const fakeFile = {
                            buffer: buffer,
                            mimetype: mimeType,
                            originalname: `image_${i}.${fileExtension}`
                        };
                        
                        // Upload to S3
                        const uploadResult = await this.s3Service.uploadImage(fakeFile, uploadProductId);
                        uploadedImageUrls.push(uploadResult.url);
                        
                        this.logger.info(`Converted base64 image ${i} to S3 URL: ${uploadResult.url}`);
                    } else {
                        // If it's not a valid base64 image, skip it
                        this.logger.warn(`Invalid base64 image format at index ${i}`);
                    }
                } else if (typeof imageData === 'string' && imageData.startsWith('http')) {
                    // If it's already a URL, keep it as is
                    uploadedImageUrls.push(imageData);
                } else {
                    this.logger.warn(`Unknown image format at index ${i}: ${typeof imageData}`);
                }
            }

            // Replace the images array with S3 URLs
            return {
                ...productData,
                images: uploadedImageUrls
            };
            
        } catch (error) {
            this.logger.error('Error processing base64 images:', error);
            throw new Error(`Failed to process images: ${error.message}`);
        }
    }
}

module.exports = ProductController; 