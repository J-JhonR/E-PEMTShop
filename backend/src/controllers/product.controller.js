// controllers/product.controller.js
const db = require('../config/database');
const imageService = require('../services/image.service');
const slugify = require('slugify');

class ProductController {
  /**
   * Récupérer tous les produits d'un vendeur
   */
  async getVendorProducts(req, res) {
    try {
      const vendorId = req.params.vendorId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const status = req.query.status;
      const search = req.query.search;

      let query = `
        SELECT p.*, 
          (SELECT COUNT(*) FROM product_images WHERE product_id = p.id AND is_primary = 1) as has_primary_image,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM vendor_products p
        WHERE p.vendor_id = ?
      `;
      
      const params = [vendorId];

      if (status && status !== 'all') {
        query += ` AND p.status = ?`;
        params.push(status);
      }

      if (search) {
        query += ` AND (p.title LIKE ? OR p.sku LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [products] = await db.query(query, params);

      // Récupérer le nombre total
      let countQuery = `SELECT COUNT(*) as total FROM vendor_products WHERE vendor_id = ?`;
      const countParams = [vendorId];
      
      if (status && status !== 'all') {
        countQuery += ` AND status = ?`;
        countParams.push(status);
      }
      
      const [totalResult] = await db.query(countQuery, countParams);
      const total = totalResult[0].total;

      // Récupérer toutes les images pour ces produits
      const productIds = products.map(p => p.id);
      let images = [];
      
      if (productIds.length > 0) {
        const [imageResults] = await db.query(
          `SELECT * FROM product_images WHERE product_id IN (?) ORDER BY sort_order`,
          [productIds]
        );
        images = imageResults;
      }

      // Grouper les images par produit
      const productsWithImages = products.map(product => ({
        ...product,
        images: images.filter(img => img.product_id === product.id)
      }));

      res.json({
        success: true,
        data: productsWithImages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur getVendorProducts:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Récupérer un produit avec ses images
   */
  async getProductById(req, res) {
    try {
      const { vendorId, productId } = req.params;

      const [products] = await db.query(
        `SELECT * FROM vendor_products WHERE id = ? AND vendor_id = ?`,
        [productId, vendorId]
      );

      if (products.length === 0) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }

      const product = products[0];

      // Récupérer les images
      const [images] = await db.query(
        `SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order`,
        [productId]
      );

      // Récupérer les variantes
      const [variants] = await db.query(
        `SELECT * FROM product_variants WHERE product_id = ?`,
        [productId]
      );

      product.images = images;
      product.variants = variants;

      res.json({ success: true, data: product });
    } catch (error) {
      console.error('Erreur getProductById:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  }

  /**
   * Créer un nouveau produit avec images
   */
  async createProduct(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const vendorId = req.params.vendorId;
      const productData = JSON.parse(req.body.productData);
      const files = req.files || [];

      // Générer le slug
      const baseSlug = slugify(productData.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      
      while (true) {
        const [existing] = await connection.query(
          `SELECT id FROM vendor_products WHERE vendor_id = ? AND slug = ?`,
          [vendorId, slug]
        );
        if (existing.length === 0) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Générer SKU si non fourni
      let sku = productData.sku;
      if (!sku) {
        sku = `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      // Insérer le produit
      const [result] = await connection.query(
        `INSERT INTO vendor_products (
          vendor_id, sku, slug, title, description, short_description,
          price, compare_price, cost_price, quantity, low_stock_threshold,
          weight, weight_unit, category_id, brand, tags, attributes,
          seo_title, seo_description, status, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vendorId, sku, slug, productData.title, productData.description,
          productData.short_description, productData.price, productData.compare_price,
          productData.cost_price, productData.quantity, productData.low_stock_threshold || 5,
          productData.weight, productData.weight_unit || 'g', productData.category_id,
          productData.brand, JSON.stringify(productData.tags || []),
          JSON.stringify(productData.attributes || {}), productData.seo_title,
          productData.seo_description, productData.status || 'draft',
          productData.is_featured || 0
        ]
      );

      const productId = result.insertId;

      // Traiter et sauvegarder les images
      let processedImages = [];
      if (files.length > 0) {
        processedImages = await imageService.processMultipleImages(
          files,
          productId,
          productData.primary_image_index || 0
        );

        for (const img of processedImages) {
          await connection.query(
            `INSERT INTO product_images (
              product_id, image_url, thumbnail_url, image_path,
              alt_text, sort_order, is_primary, file_size, mime_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              productId, img.image_url, img.thumbnail_url, img.image_path,
              img.alt_text, img.sort_order, img.is_primary,
              img.file_size, img.mime_type
            ]
          );
        }
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Produit créé avec succès',
        data: { product_id: productId, ...productData, images: processedImages }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur createProduct:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la création du produit' });
    } finally {
      connection.release();
    }
  }

  /**
   * Mettre à jour un produit
   */
  async updateProduct(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { vendorId, productId } = req.params;
      const productData = JSON.parse(req.body.productData);
      const files = req.files || [];
      const deletedImages = JSON.parse(req.body.deletedImages || '[]');

      // Vérifier que le produit appartient au vendeur
      const [existing] = await connection.query(
        `SELECT * FROM vendor_products WHERE id = ? AND vendor_id = ?`,
        [productId, vendorId]
      );

      if (existing.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }

      // Mettre à jour le produit
      await connection.query(
        `UPDATE vendor_products SET
          title = ?, description = ?, short_description = ?,
          price = ?, compare_price = ?, cost_price = ?,
          quantity = ?, low_stock_threshold = ?,
          weight = ?, weight_unit = ?, category_id = ?,
          brand = ?, tags = ?, attributes = ?,
          seo_title = ?, seo_description = ?,
          status = ?, is_featured = ?, updated_at = NOW()
        WHERE id = ? AND vendor_id = ?`,
        [
          productData.title, productData.description, productData.short_description,
          productData.price, productData.compare_price, productData.cost_price,
          productData.quantity, productData.low_stock_threshold,
          productData.weight, productData.weight_unit, productData.category_id,
          productData.brand, JSON.stringify(productData.tags || []),
          JSON.stringify(productData.attributes || {}), productData.seo_title,
          productData.seo_description, productData.status || 'draft',
          productData.is_featured || 0, productId, vendorId
        ]
      );

      // Supprimer les images marquées pour suppression
      if (deletedImages.length > 0) {
        const [imagesToDelete] = await connection.query(
          `SELECT * FROM product_images WHERE id IN (?) AND product_id = ?`,
          [deletedImages, productId]
        );

        for (const img of imagesToDelete) {
          await imageService.deleteImage(img.image_url, img.thumbnail_url);
        }

        await connection.query(
          `DELETE FROM product_images WHERE id IN (?) AND product_id = ?`,
          [deletedImages, productId]
        );
      }

      // Ajouter les nouvelles images
      if (files.length > 0) {
        // Récupérer le nombre d'images actuelles pour définir sort_order
        const [currentImages] = await connection.query(
          `SELECT COUNT(*) as count FROM product_images WHERE product_id = ?`,
          [productId]
        );
        
        const startOrder = currentImages[0].count;
        
        const processedImages = await imageService.processMultipleImages(
          files,
          productId,
          productData.primary_image_index || 0
        );

        for (let i = 0; i < processedImages.length; i++) {
          const img = processedImages[i];
          await connection.query(
            `INSERT INTO product_images (
              product_id, image_url, thumbnail_url, image_path,
              alt_text, sort_order, is_primary, file_size, mime_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              productId, img.image_url, img.thumbnail_url, img.image_path,
              img.alt_text, startOrder + i, false,
              img.file_size, img.mime_type
            ]
          );
        }
      }

      // Mettre à jour l'image principale
      if (productData.primary_image_id) {
        await connection.query(
          `UPDATE product_images SET is_primary = 0 WHERE product_id = ?`,
          [productId]
        );
        await connection.query(
          `UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?`,
          [productData.primary_image_id, productId]
        );
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Produit mis à jour avec succès'
      });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur updateProduct:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du produit' });
    } finally {
      connection.release();
    }
  }

  /**
   * Supprimer un produit
   */
  async deleteProduct(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { vendorId, productId } = req.params;

      // Récupérer les images avant suppression
      const [images] = await connection.query(
        `SELECT * FROM product_images WHERE product_id = ?`,
        [productId]
      );

      // Supprimer les fichiers physiques
      for (const img of images) {
        await imageService.deleteImage(img.image_url, img.thumbnail_url);
      }

      // Supprimer le produit (les images seront supprimées automatiquement par ON DELETE CASCADE)
      const [result] = await connection.query(
        `DELETE FROM vendor_products WHERE id = ? AND vendor_id = ?`,
        [productId, vendorId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Produit supprimé avec succès'
      });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur deleteProduct:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du produit' });
    } finally {
      connection.release();
    }
  }
}

module.exports = new ProductController();