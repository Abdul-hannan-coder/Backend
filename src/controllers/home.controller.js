// controllers/Home.controller.js
import HomePage from '../models/Home.js';
import {
  ServerError,
  ClientError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';



const getOrCreateHomepage = async () => {
  let homepage = await HomePage.findOne();
  if (!homepage) {
    homepage = await HomePage.create({
      carouselImages: [],
      categories: [],
      testimonials: [],
      aboutUs: { title: 'About Us', description: '', image: '' }
    });
  }
  return homepage;
};

// 🟢 Public - Get homepage (everyone can see)
const getHomePage = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    return SuccessResponse(res, 'Homepage retrieved successfully', homepage);
  } catch (error) {
    return ServerError(res, 'Server error while fetching homepage');
  }
};

/* ========== CAROUSEL CRUD ========== */
// Add carousel image(s) - supports file uploads (req.files) or body.image
const addCarouselImage = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();

    // If files were uploaded (carouselUpload -> req.files is an array)
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        homepage.carouselImages.push({
          title: req.body.title || '',
          description: req.body.description || '',
          image: file.path
        });
      });
    } else if (req.body.image) {
      // If frontend sent image URL in body
      homepage.carouselImages.push({
        title: req.body.title || '',
        description: req.body.description || '',
        image: req.body.image
      });
    } else {
      return ClientError(res, 'No image provided for carousel item');
    }

    await homepage.save();
    return SuccessResponse(res, 'Carousel image(s) added', homepage.carouselImages);
  } catch (error) {
    return ServerError(res, 'Server error while adding carousel image');
  }
};




// Get all carousel images
const getCarouselImages = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    return SuccessResponse(res, 'Carousel images retrieved', homepage.carouselImages);
  } catch (error) {
    return ServerError(res, 'Server error while fetching carousel images');
  }
};

// Update single carousel image
const updateCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    const image = homepage.carouselImages.id(id);
    if (!image) return ResourceNotFound(res, 'Carousel image');

    image.title = req.body.title ?? image.title;
    image.description = req.body.description ?? image.description;
    // If new file uploaded, replace image url
    if (req.files && req.files.length > 0) {
      image.image = req.files[0].path;
    } else if (req.body.image) {
      image.image = req.body.image;
    }

    await homepage.save();
    return SuccessResponse(res, 'Carousel image updated', image);
  } catch (error) {
    return ServerError(res, 'Server error while updating carousel image');
  }
};

// Delete carousel image
const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    const image = homepage.carouselImages.id(id);
    if (!image) return ResourceNotFound(res, 'Carousel image');

    image.deleteOne();
    await homepage.save();

    return SuccessResponse(res, 'Carousel image deleted', homepage.carouselImages);
  } catch (error) {
    return ServerError(res, 'Server error while deleting carousel image');
  }
};

/* ========== CATEGORIES CRUD ========== */
const addCategory = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();

    const category = {
      title: req.body.title || '',
      description: req.body.description || '',
      image: req.file?.path || req.body.categoryImage || ''
    };

    homepage.categories.push(category);
    await homepage.save();

    return SuccessResponse(res, 'Category added', homepage.categories);
  } catch (error) {
    return ServerError(res, 'Server error while adding category');
  }
};

const getCategories = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    return SuccessResponse(res, 'Categories retrieved', homepage.categories);
  } catch (error) {
    return ServerError(res, 'Server error while fetching categories');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    const category = homepage.categories.id(id);
    if (!category) return ResourceNotFound(res, 'Category');

    category.title = req.body.title ?? category.title;
    category.description = req.body.description ?? category.description;
    if (req.file) category.image = req.file.path;
    else if (req.body.categoryImage) category.image = req.body.categoryImage;

    await homepage.save();
    return SuccessResponse(res, 'Category updated', category);
  } catch (error) {
    return ServerError(res, 'Server error while updating category');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    const category = homepage.categories.id(id);
    if (!category) return ResourceNotFound(res, 'Category');

    category.deleteOne();
    await homepage.save();

    return SuccessResponse(res, 'Category deleted', homepage.categories);
  } catch (error) {
    return ServerError(res, 'Server error while deleting category');
  }
};

/* ========== TESTIMONIALS CRUD ========== */
const addTestimonial = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();

    const testimonial = {
      name: req.body.name || '',
      feedback: req.body.feedback || '',
      image: req.file?.path || req.body.testimonialImage || ''
    };

    homepage.testimonials.push(testimonial);
    await homepage.save();

    return SuccessResponse(res, 'Testimonial added', homepage.testimonials);
  } catch (error) {
    return ServerError(res, 'Server error while adding testimonial');
  }
};

const getTestimonials = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    return SuccessResponse(res, 'Testimonials retrieved', homepage.testimonials);
  } catch (error) {
    return ServerError(res, 'Server error while fetching testimonials');
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    const testimonial = homepage.testimonials.id(id);
    if (!testimonial) return ResourceNotFound(res, 'Testimonial');

    testimonial.name = req.body.name ?? testimonial.name;
    testimonial.feedback = req.body.feedback ?? testimonial.feedback;
    if (req.file) testimonial.image = req.file.path;
    else if (req.body.testimonialImage) testimonial.image = req.body.testimonialImage;

    await homepage.save();
    return SuccessResponse(res, 'Testimonial updated', testimonial);
  } catch (error) {
    return ServerError(res, 'Server error while updating testimonial');
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    const testimonial = homepage.testimonials.id(id);
    if (!testimonial) return ResourceNotFound(res, 'Testimonial');

    testimonial.deleteOne();
    await homepage.save();

    return SuccessResponse(res, 'Testimonial deleted', homepage.testimonials);
  } catch (error) {
    return ServerError(res, 'Server error while deleting testimonial');
  }
};

/* ========== ABOUT US CRUD ========== */
const addAboutUs = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();

    homepage.aboutUs = {
      title: req.body.title || homepage.aboutUs?.title || 'About Us',
      description: req.body.description || homepage.aboutUs?.description || '',
      image: req.file?.path || req.body.image || homepage.aboutUs?.image || ''
    };

    await homepage.save();
    return SuccessResponse(res, 'About Us added', homepage.aboutUs);
  } catch (error) {
    return ServerError(res, 'Server error while adding About Us');
  }
};

const getAboutUs = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();
    return SuccessResponse(res, 'About Us retrieved', homepage.aboutUs);
  } catch (error) {
    return ServerError(res, 'Server error while fetching About Us');
  }
};

const updateAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const homepage = await getOrCreateHomepage();

    // If an id is provided we keep compatibility with routes expecting an id for aboutus
    homepage.aboutUs = {
      title: req.body.title ?? homepage.aboutUs?.title,
      description: req.body.description ?? homepage.aboutUs?.description,
      image: req.file?.path ?? req.body.image ?? homepage.aboutUs?.image
    };

    await homepage.save();
    return SuccessResponse(res, 'About Us updated', homepage.aboutUs);
  } catch (error) {
    return ServerError(res, 'Server error while updating About Us');
  }
};

const deleteAboutUs = async (req, res) => {
  try {
    const homepage = await getOrCreateHomepage();

    homepage.aboutUs = { title: 'About Us', description: '', image: '' };
    await homepage.save();

    return SuccessResponse(res, 'About Us deleted', homepage.aboutUs);
  } catch (error) {
    return ServerError(res, 'Server error while deleting About Us');
  }
};

export {
  getHomePage,
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
};
