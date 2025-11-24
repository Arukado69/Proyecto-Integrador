package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ReviewNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Review;
import org.proyecto_integrador.woofandbarf.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id));
    }

    public List<Review> findByProductId(Long productId) {
        return reviewRepository.findByProduct_Id(productId);
    }

    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ReviewNotFoundException(id);
        }
        reviewRepository.deleteById(id);
    }
}
