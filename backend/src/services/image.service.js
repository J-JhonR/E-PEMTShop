// services/image.service.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ImageService {
  constructor() {
    this.basePath = 'uploads/products';
    this.thumbnailPath = 'uploads/products/thumbnails';
  }

  /**
   * Traite et sauvegarde une image
   */
  async processImage(file, productId, isPrimary = false, altText = '') {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      const filename = `${productId}-${timestamp}-${uniqueId}${ext}`;
      const thumbnailFilename = `thumb-${productId}-${timestamp}-${uniqueId}${ext}`;
      
      const filepath = path.join(this.basePath, filename);
      const thumbnailFilepath = path.join(this.thumbnailPath, thumbnailFilename);

      // Optimiser et redimensionner l'image principale
      await sharp(file.path)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(filepath);

      // Créer une miniature
      await sharp(file.path)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 80, progressive: true })
        .toFile(thumbnailFilepath);

      // Supprimer le fichier temporaire
      await fs.unlink(file.path).catch(err => console.error('Erreur suppression temp:', err));

      // Extraire les informations du fichier
      const stats = await fs.stat(filepath);
      
      return {
        image_url: `/uploads/products/${filename}`,
        thumbnail_url: `/uploads/products/thumbnails/${thumbnailFilename}`,
        image_path: filepath,
        file_size: stats.size,
        mime_type: 'image/jpeg',
        alt_text: altText || file.originalname,
        is_primary: isPrimary,
        sort_order: 0
      };
    } catch (error) {
      console.error('Erreur traitement image:', error);
      throw error;
    }
  }

  /**
   * Traite plusieurs images
   */
  async processMultipleImages(files, productId, primaryIndex = 0) {
    const processedImages = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPrimary = i === primaryIndex;
      
      const imageData = await this.processImage(
        file, 
        productId, 
        isPrimary,
        `Image ${i + 1} du produit`
      );
      
      imageData.sort_order = i;
      processedImages.push(imageData);
    }
    
    return processedImages;
  }

  /**
   * Supprime une image
   */
  async deleteImage(imageUrl, thumbnailUrl) {
    try {
      const imagePath = path.join('.', imageUrl);
      const thumbnailPath = path.join('.', thumbnailUrl);
      
      await fs.unlink(imagePath).catch(err => console.error('Erreur suppression image:', err));
      await fs.unlink(thumbnailPath).catch(err => console.error('Erreur suppression thumbnail:', err));
      
      return true;
    } catch (error) {
      console.error('Erreur suppression image:', error);
      return false;
    }
  }

  /**
   * Supprime toutes les images d'un produit
   */
  async deleteProductImages(productId, images) {
    const promises = images.map(img => 
      this.deleteImage(img.image_url, img.thumbnail_url)
    );
    
    return Promise.all(promises);
  }
}

module.exports = new ImageService();