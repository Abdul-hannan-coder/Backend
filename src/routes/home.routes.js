
import express from 'express';
import {
  addCarouselImage,
  getCarouselImages,
  updateCarouselImage,
  deleteCarouselImage,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
  addAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs
} from '../controllers/home.controller.js';

import {
  carouselUpload,
  categoryImageUpload,
  testimonialImageUpload
} from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HomePage
 *   description: Homepage management
 */

/**
 * @swagger
 * /api/v1/home/homepage/carousel:
 *   post:
 *     summary: Add a carousel image
 *     tags: [HomePage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               carouselImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Carousel image added
 */
router.post('/homepage/carousel', carouselUpload, addCarouselImage);

/**
 * @swagger
 * /api/v1/home/homepage/carousel:
 *   get:
 *     summary: Get all carousel images
 *     tags: [HomePage]
 *     responses:
 *       200:
 *         description: List of carousel images
 */
router.get('/homepage/carousel', getCarouselImages);

/**
 * @swagger
 * /api/v1/home/homepage/carousel/{id}:
 *   put:
 *     summary: Update a carousel image
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               carouselImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Carousel image updated
 */
router.put('/homepage/carousel/:id', carouselUpload, updateCarouselImage);

/**
 * @swagger
 * /api/v1/home/homepage/carousel/{id}:
 *   delete:
 *     summary: Delete a carousel image
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carousel image deleted
 */
router.delete('/homepage/carousel/:id', deleteCarouselImage);

/**
 * @swagger
 * /api/v1/home/homepage/category:
 *   post:
 *     summary: Add a category
 *     tags: [HomePage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category added
 */
router.post('/homepage/category', categoryImageUpload, addCategory);

/**
 * @swagger
 * /api/v1/home/homepage/category:
 *   get:
 *     summary: Get all categories
 *     tags: [HomePage]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/homepage/category', getCategories);

/**
 * @swagger
 * /api/v1/home/homepage/category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/homepage/category/:id', categoryImageUpload, updateCategory);

/**
 * @swagger
 * /api/v1/home/homepage/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/homepage/category/:id', deleteCategory);

/**
 * @swagger
 * /api/v1/home/homepage/testimonial:
 *   post:
 *     summary: Add a testimonial
 *     tags: [HomePage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               feedback:
 *                 type: string
 *               testimonialImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testimonial added
 */
router.post('/homepage/testimonial', testimonialImageUpload, addTestimonial);

/**
 * @swagger
 * /api/v1/home/homepage/testimonial:
 *   get:
 *     summary: Get all testimonials
 *     tags: [HomePage]
 *     responses:
 *       200:
 *         description: List of testimonials
 */
router.get('/homepage/testimonial', getTestimonials);

/**
 * @swagger
 * /api/v1/home/homepage/testimonial/{id}:
 *   put:
 *     summary: Update a testimonial
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               feedback:
 *                 type: string
 *               testimonialImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testimonial updated
 */
router.put('/homepage/testimonial/:id', testimonialImageUpload, updateTestimonial);

/**
 * @swagger
 * /api/v1/home/homepage/testimonial/{id}:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonial deleted
 */
router.delete('/homepage/testimonial/:id', deleteTestimonial);

/**
 * @swagger
 * /api/v1/home/homepage/aboutus:
 *   post:
 *     summary: Add About Us section
 *     tags: [HomePage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: About Us section added
 */
router.post('/homepage/aboutus', addAboutUs);

/**
 * @swagger
 * /api/v1/home/homepage/aboutus:
 *   get:
 *     summary: Get About Us section
 *     tags: [HomePage]
 *     responses:
 *       200:
 *         description: About Us section
 */
router.get('/homepage/aboutus', getAboutUs);

/**
 * @swagger
 * /api/v1/home/homepage/aboutus/{id}:
 *   put:
 *     summary: Update About Us section
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: About Us section updated
 */
router.put('/homepage/aboutus/:id', updateAboutUs);

/**
 * @swagger
 * /api/v1/home/homepage/aboutus/{id}:
 *   delete:
 *     summary: Delete About Us section
 *     tags: [HomePage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: About Us section deleted
 */
router.delete('/homepage/aboutus/:id', deleteAboutUs);

export default router;
