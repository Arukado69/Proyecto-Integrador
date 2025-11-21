package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ProductNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.ReviewNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Product;
import org.proyecto_integrador.woofandbarf.model.Review;
import org.proyecto_integrador.woofandbarf.repository.ProductRepository;
import org.proyecto_integrador.woofandbarf.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public List<Review> getByProduct(Long idProduct) {
        return reviewRepository.findByProduct_Id(idProduct);
    }

    public Review create(Long idProduct, Review review) {
        Product product = productRepository.findById(idProduct)
                .orElseThrow(() -> new ProductNotFoundException(idProduct));

        review.setProduct(product);

        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("La calificación debe ser entre 1 y 5");
        }

        return reviewRepository.save(review);
    }

    public void delete(Long idReview) {
        if (!reviewRepository.existsById(idReview)) {
            throw new ReviewNotFoundException(idReview);
        }
        reviewRepository.deleteById(idReview);
    }
}

